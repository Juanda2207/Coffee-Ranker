import { supabase } from "@/lib/supabase";
import CoffeeList from "@/components/CoffeeList";
import { CoffeeWithReview } from "@/types";

export default async function Page() {

    const { data: coffees } = await supabase
        .from("coffee")
        .select(`
            id, 
            name, 
            description, 
            image,
            review(score)`);

    return <CoffeeList initialCoffees={coffees as CoffeeWithReview[] || []} />;
}