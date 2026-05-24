import { writeFileSync } from "fs";
import { getRepos, renderProjectRepos } from "./repo";

const repos = await getRepos();

function render(name: string, npm: string) {
    writeFileSync("html/" + name + ".html", renderProjectRepos(repos, name, npm));
}

render("ValtheraDB", "@wxn0brp/db");
render("VQL", "@wxn0brp/vql");
