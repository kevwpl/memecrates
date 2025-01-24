<script lang="ts">
    import {Handshake, LayoutDashboard, Loader, Plus, ReceiptEuro, UserPlus} from "lucide-svelte";
    import { t } from "$lib/i18n.svelte.ts";
    import {Button, buttonVariants} from "$lib/components/ui/button";
    import {columns} from "./ServiceColumns";
    import {Label} from "$lib/components/ui/label";
    import CustomerDataTable from "../customers/CustomerDataTable.svelte";
    import {Input} from "$lib/components/ui/input";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import {toast} from "svelte-sonner";
    import {broadcaster} from "$lib/stores/stores";
    import ServiceDataTable from "./ServiceDataTable.svelte";
    let data = $state([]);
    let loading = $state(true);

    let newName = $state("");
    let newPrice = $state(0);

    const API_URL = '/api/get/services';
    async function fetchData() {
        loading = true;
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

    const createNewService = async () => {
        loading = true;
        try {
            // Retrieve sessionToken and company from sessionStorage
            const sessionToken = sessionStorage.getItem("token");
            const company = sessionStorage.getItem("Company");

            // Validate required fields
            if (!sessionToken || !company || !newName) {
                toast.error("Please fill in all required fields.");
                loading = false;
                return;
            }

            // Construct the payload
            const payload = {
                sessionToken,
                name: newName,
                price: newPrice,
                company
            };

            // Send POST request to the API endpoint
            const response = await fetch("/api/add/service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // Handle the API response
            if (response.ok) {
                const data = await response.json();
                toast.success("Service added successfully!");
                console.log("New Service:", data);
                fetchData();
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.error}`);
                loading = false;
            }
        } catch (err) {
            console.error("Error creating new customer:", err);
            toast.error("An error occurred while adding the service.");
            loading = false;
        }
    };

    $effect.pre(() => {
        fetchData();

        broadcaster.subscribe((value) => {
            if(value === "refreshServices"){
                fetchData();
                broadcaster.set(null);
            }
        })
    });
</script>

<div class="flex justify-between align-middle items-center">
    <div>
        <h1 class="font-bold text-2xl flex items-center gap-2"><Handshake />{t("services.services")}</h1>
        <h4 class="text-muted-foreground">{t("services.desc")}</h4>
    </div>
    <Sheet.Root>
        <Sheet.Trigger class={buttonVariants({ variant: "default" })}><Plus />{t("services.addservice")}</Sheet.Trigger>
        <Sheet.Content>
            <Sheet.Header>
                <Sheet.Title class="flex items-center align-middle gap-2"><UserPlus />{t("services.addservice")}</Sheet.Title>
                <Sheet.Description>

                </Sheet.Description>
            </Sheet.Header>

            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">{t("customers.name")}</Label>
                    <Input id="name" bind:value={newName} placeholder="Support" class="col-span-3" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="price" class="text-right">{t("customers.name")}</Label>
                    <Input id="price" type="number" bind:value={newPrice} placeholder="20" class="col-span-3" />
                </div>
                <Sheet.Footer>
                    <Sheet.Close>
                        <div class="text-right">
                            <Button onclick={() => createNewService()}>{t("customers.submit")}</Button>
                        </div>
                    </Sheet.Close>
                </Sheet.Footer>
            </div>
        </Sheet.Content>
    </Sheet.Root>
</div>

<main class="mt-4 w-full">

    {#if !loading}
        <ServiceDataTable {data} {columns}/>
    {:else}
        <div class="flex w-full justify-center items-center mt-24">
            <Loader class="animate-spin text-gray-300" />
        </div>
    {/if}
</main>

<main>

</main>

<svelte:head>
    <title>{t("services.title")}</title>
</svelte:head>