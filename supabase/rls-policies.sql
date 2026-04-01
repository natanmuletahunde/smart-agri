-- Run AFTER creating tables from plan.md. Adjust if your schema differs.
-- Enables RLS and policies so the Next.js app can read/write as intended.

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone authenticated can read (marketplace seller names); users manage own row
CREATE POLICY "profiles_select_authenticated" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Products: public read; farmers manage own
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_farmer" ON products FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = farmer_id
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'farmer')
  );
CREATE POLICY "products_update_own" ON products FOR UPDATE TO authenticated USING (auth.uid() = farmer_id);
CREATE POLICY "products_delete_own" ON products FOR DELETE TO authenticated USING (auth.uid() = farmer_id);

-- Orders: buyers create/read own; farmers can read orders that include their products (via app query)
CREATE POLICY "orders_insert_buyer" ON orders FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'buyer')
  );
CREATE POLICY "orders_select_buyer" ON orders FOR SELECT TO authenticated USING (auth.uid() = buyer_id);

-- Order items: buyer can insert when part of their order; read if buyer or product owner
CREATE POLICY "order_items_insert_buyer" ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id AND o.buyer_id = auth.uid()
    )
  );
CREATE POLICY "order_items_select" ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM products pr
    WHERE pr.id = order_items.product_id AND pr.farmer_id = auth.uid()
  )
);

-- Deliveries: buyer creates with order; read if buyer or farmer of product in order (simplified: link via order)
CREATE POLICY "deliveries_insert_buyer" ON deliveries FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = deliveries.order_id AND o.buyer_id = auth.uid())
  );
CREATE POLICY "deliveries_select_related" ON deliveries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders o WHERE o.id = deliveries.order_id AND o.buyer_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM order_items oi
    JOIN products pr ON pr.id = oi.product_id
    WHERE oi.order_id = deliveries.order_id AND pr.farmer_id = auth.uid()
  )
);
