<script lang="ts">
    import {LayoutDashboard, Loader, Loader2, ReceiptEuro, UserPlus, Users} from "lucide-svelte";
    import { t } from "$lib/i18n.svelte.ts";
    import CustomerDataTable from "./CustomerDataTable.svelte";
    import { columns } from "./CustomerColumns.ts";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {toast} from "svelte-sonner";

    let data = $state([]);
    let loading = $state(true);

    let newName = $state("");
    let newStreet = $state("");
    let newTown = $state("");
    let newZip = $state("");
    let newUID = $state("");

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

    const createNewCustomer = async () => {
        try {
            // Retrieve sessionToken and company from sessionStorage
            const sessionToken = sessionStorage.getItem("token");
            const company = sessionStorage.getItem("Company");

            // Validate required fields
            if (!sessionToken || !company || !newName || !newStreet || !newTown) {
                toast.error("Please fill in all required fields.");
                return;
            }

            // Construct the payload
            const payload = {
                sessionToken,
                name: newName,
                street: newStreet,
                zip: "123", // Add zip if available or modify accordingly
                town: newTown,
                uid: newUID || null,
                company
            };

            // Send POST request to the API endpoint
            const response = await fetch("/api/add/customer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // Handle the API response
            if (response.ok) {
                const data = await response.json();
                toast.success("Customer added successfully!");
                console.log("New Customer:", data);
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.error}`);
            }
        } catch (err) {
            console.error("Error creating new customer:", err);
            toast.error("An error occurred while adding the customer.");
        }
    };

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
                <Sheet.Title class="flex items-center align-middle gap-2"><UserPlus />{t("customers.addcustomer")}</Sheet.Title>
                <Sheet.Description>

                </Sheet.Description>
            </Sheet.Header>

            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">{t("customers.name")}</Label>
                    <Input id="name" bind:value={newName} placeholder="John Doe" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="street" class="text-right">{t("customers.street")}</Label>
                    <Input id="street" bind:value={newStreet} placeholder="Defaultstreet 13" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="zip" class="text-right">{t("customers.zip")}</Label>
                    <Input id="zip" bind:value={newZip} placeholder="1234" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="street" class="text-right">{t("customers.town")}</Label>
                    <Input id="street" bind:value={newTown} placeholder="Los Angeles" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="street" class="text-right">{t("customers.uid")}</Label>
                    <Input id="street" bind:value={newUID} placeholder="ATU12345678" class="col-span-3" />
                </div>
                <div class="text-right">
                    <Button onclick={createNewCustomer}>{t("customers.submit")}</Button>
                </div>
            </div>
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