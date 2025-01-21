<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import GalleryVerticalEnd from "lucide-svelte/icons/gallery-vertical-end";
    import type {Company} from "$lib/types";
    import {useSidebar} from "$lib/components/ui/sidebar/index.js";
    import {onDestroy} from "svelte";
    import { t } from "$lib/i18n.svelte";
    import { currentCompany } from "$lib/stores/stores";

    let { companies, defaultCompany }: { companies: Company[]; defaultCompany: Company } = $props();

    let selectedCompany = $state(defaultCompany);

    const sidebar = useSidebar();

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.ctrlKey) {
            // Convert the key to a number and adjust the index by subtracting 1
            const index = Number(event.key) - 1;
            if (index >= 0 && index < companies.length) {
                event.preventDefault()
                selectedCompany = companies[index];
            }
        }
    };

    const selectCompany = (company: Company) => {
        selectedCompany = company;
        sessionStorage.setItem("Company", selectedCompany.uuid);
    }

    $effect.pre(() => {
        currentCompany.set(companies[0]);
        sessionStorage.setItem("Company", companies[0].uuid);
    })
</script>

<Sidebar.Menu>
    <Sidebar.MenuItem>
        {#if selectedCompany}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Sidebar.MenuButton
                                size="lg"
                                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                {...props}
                        >
                            {@const Icon = selectedCompany.icon}
                            <div
                                    class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                            >
                                <Icon class="size-4"/>
                            </div>
                            <div class="flex flex-col gap-0.5 leading-none">
                                <span class="font-semibold">{selectedCompany.name}</span>
                                <span class="font-semibold text-xs text-muted-foreground">{selectedCompany.uid}</span>
                            </div>
                            <ChevronsUpDown class="ml-auto" />
                        </Sidebar.MenuButton>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                        class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
                        align="start"
                        side={sidebar.isMobile ? "bottom" : "right"}
                        sideOffset={4}>
                    <DropdownMenu.Label class="text-muted-foreground text-xs">{t("nav.companies")}</DropdownMenu.Label>
                    {#each companies as company, index (company.name)}
                        {@const Icon = company.icon}
                        <DropdownMenu.Item onSelect={() => {selectCompany(company)}}>
                            <div class="flex size-6 items-center justify-center rounded-sm border">
                                <Icon class="size-4 shrink-0" />
                            </div>
                            {company.name}
                            {#if company === selectedCompany}
                                <Check class="ml-auto" />
                            {:else}
                                <DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
                            {/if}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {/if}
    </Sidebar.MenuItem>
</Sidebar.Menu>