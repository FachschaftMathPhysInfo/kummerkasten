export function Footer() {
  return (
    <footer className="flex justify-evenly w-full py-5 px-10 text-sm text-muted-foreground border-t mt-5">
      <span>
        <a className="cursor-pointer underline" href="https://mathphys.stura.uni-heidelberg.de/kontakt/">
          Kontakt
        </a>
      </span>
      <span>
        <a className={"cursor-pointer underline"} href="https://mathphys.stura.uni-heidelberg.de/">
          Impressum
        </a>
      </span>
      <span>
        <a
          className="cursor-pointer underline"
          href="https://github.com/plebysnacc/kummerkasten"
        >
          Source Code
        </a>
      </span>
    </footer>
  );
}