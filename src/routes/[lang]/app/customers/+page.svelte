<script lang="ts">
    import {LayoutDashboard, Loader, Loader2, ReceiptEuro, UserPlus, Users} from "lucide-svelte";
    import { t } from "$lib/i18n.svelte.ts";
    import CustomerDataTable from "./CustomerDataTable.svelte";
    import { columns } from "./CustomerColumns.ts";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";

    let data = $state([]);
    let loading = $state(true);

    const API_URL = '/api/get/customers';
    async function fetchData() {
        const sessionToken = sessionStorage.getItem("token") || "";
        const company = sessionStorage.getItem("Company");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionToken, company }), // Include company in the request body
            });
            if (response.ok) {
                data = await response.json();
                console.log(data);
                loading = false;
            } else {
                throw new Error('Fehler beim Abrufen der Daten: ' + response.statusText);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
            return [];
        }
    }

    $effect.pre(() => {
        fetchData();
    });

</script>

<div class="flex justify-between align-middle items-center">
    <div>
        <h1 class="font-bold text-2xl flex items-center gap-2"><Users />{t("customers.customers")}</h1>
        <h4 class="text-muted-foreground">{t("customers.desc")}</h4>
    </div>
    <Sheet.Root>
        <Sheet.Trigger class={buttonVariants({ variant: "default" })}><UserPlus />{t("customers.addcustomer")}</Sheet.Trigger>
        <Sheet.Content>
            <Sheet.Header>
                <Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
                <Sheet.Description>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </Sheet.Description>
            </Sheet.Header>
        </Sheet.Content>
    </Sheet.Root>
</div>

<main class="mt-4 w-full">

    {#if !loading}
        <CustomerDataTable {data} {columns}/>
    {:else}
        <div class="flex w-full justify-center items-center mt-24">
            <Loader class="animate-spin text-gray-300" />
        </div>
    {/if}
</main>

<svelte:head>
    <title>{t("customers.title")}</title>
</svelte:head>