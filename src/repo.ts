const cacheKey = "wxn/main/data";
const ttl = 60 * 60 * 1000; // hour

interface Repo {
    name: string;
    html_url: string;
    description?: string;
}

export function loadRepos() {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < ttl) return renderRepos(data.data);
        else localStorage.removeItem(cacheKey);
    }

    fetch("https://api.github.com/users/wxn0brP/repos?per_page=100")
        .then(res => res.json())
        .then(data => {
            localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
            renderRepos(data);
        });
}

function renderRepos(repos: Repo[]) {
    function render(qs: string, prefix: string, npm: string) {
        let list = document.querySelector<HTMLUListElement>(qs);
        list.innerHTML = "";
        const filtered = repos.filter(r => r.name.startsWith(prefix + "-"))
        if (npm) {
            filtered.push({
                name: "NPM package",
                html_url: `https://www.npmjs.com/package/${npm}`
            })
        }
        filtered.sort((a, b) => a.name.localeCompare(b.name))
            .forEach(r => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="${r.html_url}" target="_blank">${r.name.replace(prefix + "-", "")}</a>`;
                if (r.description) {
                    const desc = r.description;
                    li.innerHTML += " - ";
                    li.innerHTML += desc.startsWith(prefix) ? desc : desc;
                }
                list.appendChild(li);
            });
    }

    render("#valtheradb-links", "ValtheraDB", "@wxn0brp/db");
    render("#vql-links", "VQL", "@wxn0brp/vql");
}