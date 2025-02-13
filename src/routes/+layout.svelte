<script>
    import {ModeWatcher} from "mode-watcher";
    import { setMode } from "mode-watcher";

    setMode("dark");

    let { children } = $props();
    import "../app.css";
</script>

<ModeWatcher />
{@render children()}