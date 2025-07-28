import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Save a new kit
    const { user_id, kit_name, products, quantities } = req.body;

    if (!user_id || !kit_name || !products || !quantities) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const { data, error } = await supabase
      .from("kits")
      .insert([{ user_id, kit_name, products, quantities }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ kit: data[0] });
  } else if (req.method === "GET") {
    // Fetch kits for a user
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id." });
    }

    const { data, error } = await supabase
      .from("kits")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ kits: data });
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
