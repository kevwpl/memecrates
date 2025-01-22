<script lang="ts">
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {Eye, FilePlus, Pen, Trash} from "lucide-svelte";
    import {toast} from "svelte-sonner";

    let { id }: { id: string } = $props();

    const deleteCustomer = async (customer: string) => {
        try {
            // Retrieve sessionToken from sessionStorage
            const sessionToken = sessionStorage.getItem("token");

            // Validate required fields
            if (!sessionToken || !customer) {
                toast.error("Missing required information. Please try again.");
                return;
            }

            // Construct the payload
            const payload = {
                sessionToken,
                customerId: customer
            };

            // Send DELETE request to the API endpoint
            const response = await fetch("/api/delete/customer", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            // Handle the API response
            if (response.ok) {
                const data = await response.json();
                toast.success("Customer deleted successfully!");
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.error}`);
            }
        } catch (err) {
            console.error("Error deleting customer:", err);
            toast.error("An error occurred while deleting the customer.");
        }
    };
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button
                    {...props}
                    variant="ghost"
                    size="icon"
                    class="relative size-8 p-0"
            >
                <span class="sr-only">Open menu</span>
                <Ellipsis />
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
            <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
                <FilePlus /> Create invoice
            </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item><Eye />View</DropdownMenu.Item>
        <DropdownMenu.Item><Pen />Edit</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item class="text-red-500 hover:text-red-900" onclick={() => {deleteCustomer(id)}}><Trash />Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>