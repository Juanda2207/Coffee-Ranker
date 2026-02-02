"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Coffee } from "@/types";

import styles from './CoffeeList.module.css';
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faStar } from "@fortawesome/free-solid-svg-icons";

interface Props {
    initialCoffees: Coffee[];
}

export default function CoffeeList({ initialCoffees }: Props) {

    const [coffees, setCoffees] = useState<Coffee[]>(initialCoffees);

    useEffect(() => {
        const getCoffees = async () => {
            const { data, error } = await supabase
                .from("coffee")
                .select("id, name, description, image");

            if (error) {
                console.error("Error fetching coffees:", error);
            } else {
                setCoffees(data || []);
            }
        };
        getCoffees(); // First call
        const channel = supabase
            .channel('sync-coffees')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'coffee'
                },
                (payload) => {
                    console.log('Change received!', payload);
                    switch (payload.eventType) {
                        case 'INSERT':
                            setCoffees((prev) => [...prev, payload.new]);
                            break;
                        case 'UPDATE':
                            setCoffees((prev) => prev.map(item => item.id === payload.new.id ? payload.new : item));
                            break;
                        case 'DELETE':
                            setCoffees((prev) => prev.filter(item => item.id !== payload.old.id));
                            break;
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className={styles.coffeeList}>
            {coffees.map(coffee => (
                <div key={coffee.id} className={styles.coffeeListItem}>

                    <div className={styles.coffeeImageContainer}>
                        <Image src={coffee.image} alt={coffee.name} className={styles.coffeeImage} width={1920} height={1080}></Image>
                    </div>

                    <div className={styles.coffeeTitleContainer}>
                        <h3 className={styles.coffeeTitle}>{coffee.name}</h3>
                    </div>

                    <p className={styles.coffeeDescription}>{coffee.description}</p>

                    <div className={styles.coffeeRankingContainer}>
                        <div className={styles.coffeeRankingStars}>
                            <FontAwesomeIcon icon={faStar} className={styles.coffeeStartsIcon} />
                            <span className={styles.coffeeStartsCount}>{coffee.rating || '5.0'}</span>
                        </div>
                        <span className={styles.coffeeCountReviews}>({coffee.review_count || 0} reviews)</span>
                    </div>
                </div>
            ))}
        </div>
    );
}