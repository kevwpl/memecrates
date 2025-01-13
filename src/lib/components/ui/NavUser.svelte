<script lang="ts">

    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";
    import type {User} from "$lib/types";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import {BadgeCheck, Bell, CreditCard, LogOut, Moon, Sun} from "lucide-svelte";
    import {goto} from "$app/navigation";
    import { toggleMode } from "mode-watcher";

    let { user } : { user: User} = $props();

    function logOut(){
        sessionStorage.removeItem("token");
        goto("/en/login");
    }
</script>

<Sidebar.Menu>
    {#if user && user.email}
        <Sidebar.MenuItem>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Sidebar.MenuButton
                                {...props}
                                size="lg"
                                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar.Root class="h-8 w-8 rounded-lg">
                                <Avatar.Image src={"data:image/png;base64," + user.avatar} alt={"Avatar"} />
                                <Avatar.Fallback class="rounded-lg">{user.firstname.charAt(0) + user.lastname.charAt(0)}</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">{user.firstname + " " + user.lastname}</span>
                                <span class="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown class="ml-auto size-4" />
                        </Sidebar.MenuButton>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                        class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
                        side={"right"}
                        align="end"
                        sideOffset={4}
                >
                    <DropdownMenu.Label class="p-0 font-normal">
                        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar.Root class="h-8 w-8 rounded-lg">
                                <Avatar.Image src={"data:image/png;base64," + user.avatar} alt={"Avatar"} />
                                <Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">{user.firstname + " " + user.lastname}</span>
                                <span class="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                        <DropdownMenu.Item onclick={toggleMode}>
                            <Sun
                                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                            />
                            <Moon
                                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                            />
                            Theme
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                        <DropdownMenu.Item>
                            <BadgeCheck />
                            Account
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <CreditCard />
                            Billing
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <Bell />
                            Notifications
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onclick={logOut}>
                        <LogOut />
                        Log out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Sidebar.MenuItem>
    {/if}
</Sidebar.Menu>