<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar";
    import MainSidebar from "$lib/components/ui/Sidebar.svelte"

    import "../../../app.css";
    import type {User} from "$lib/types";
    import {goto} from "$app/navigation";

    let { children } = $props();
    async function fetchUser(
        endpoint: string,
        sessionToken: string
    ) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionToken }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                goto("/en/login");
            }
        } catch (error) {
            goto("/en/login");
        }
    }

    $effect.pre(() => {
        fetchUser("/api/get/user/token", sessionStorage.getItem("token") || "");
    })
</script>

<Sidebar.Provider>
    <MainSidebar/>
    <main class="w-full">
        <Sidebar.Trigger class="m-2"/>
        <div class="justify-center w-2/3 mx-auto h-full">
            {@render children?.()}
        </div>
    </main>
</Sidebar.Provider>

