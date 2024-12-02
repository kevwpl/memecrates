import type {SvelteComponent} from "svelte";

export type Company = {
    name: string,
    icon: typeof SvelteComponent
}