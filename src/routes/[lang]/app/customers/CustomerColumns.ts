import type {ColumnDef} from "@tanstack/table-core";
import type {Customer} from "$lib/types";
import {t} from "$lib/i18n.svelte";

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: t("customers.name"),
    },
    {
        accessorKey: "street",
        header: t("customers.street"),
    },
    {
        accessorKey: "zip",
        header: t("customers.zip"),
    },
    {
        accessorKey: "town",
        header: t("customers.town"),
    },
    {
        accessorKey: "uid",
        header: t("customers.uid"),
    }
];