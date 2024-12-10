<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar";
    import MainSidebar from "$lib/components/ui/Sidebar.svelte"

    import "../../../app.css";

    let { children } = $props();
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

