import { supabase } from "@/lib/supabase";
import CoffeeList from "@/components/CoffeeList";

export default async function Page() {

    const { data: coffees } = await supabase
        .from("coffee")
        .select("id, name, description, image");

    return <CoffeeList initialCoffees={coffees || []} />;
}