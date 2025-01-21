<script lang="ts">
    import {LayoutDashboard, ReceiptEuro, Users} from "lucide-svelte";
    import { t } from "$lib/i18n.svelte.ts";
    import CustomerDataTable from "./CustomerDataTable.svelte";
    import { columns } from "./CustomerColumns.ts";

    let data = $state();
    let loading = $state(true);

    const API_URL = '/api/get/customers';
    async function fetchData() {
        const sessionToken = sessionStorage.getItem("token") || "";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionToken }),
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
    })

</script>

<div>
    <h1 class="font-bold text-2xl flex items-center gap-2"><Users />{t("customers.customers")}</h1>
    <h4 class="text-muted-foreground">{t("customers.desc")}</h4>
</div>

<main class="mt-4">

    {#if !loading}
        <CustomerDataTable {data} {columns}/>
    {/if}
</main>

<svelte:head>
    <title>{t("customers.title")}</title>
</svelte:head>