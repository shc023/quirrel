import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

function PillButton({
  selected,
  title,
  ...rest
}: React.HTMLProps<HTMLAnchorElement> & { selected: boolean; title: string }) {
  return (
    <a
      {...rest}
      className={clsx(
        selected
          ? "text-white bg-orange-500"
          : "text-gray-800 hover:text-white hover:bg-orange-300",
        "px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:text-white focus:bg-orange-300 cursor-pointer"
      )}
    >
      {title}
    </a>
  );
}

function MenuButton({
  selected,
  title,
  ...rest
}: React.HTMLProps<HTMLAnchorElement> & { selected: boolean; title: string }) {
  return (
    <a
      {...rest}
      className={clsx(
        selected
          ? "text-white bg-orange-500"
          : "text-gray-800 hover:text-white hover:bg-orange-300",
        "block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-orange-300 cursor-pointer"
      )}
    >
      {title}
    </a>
  );
}

export interface NavProps {
  selectedPage?: "activity" | "pending" | "cron";
}

export function Nav(props: NavProps) {
  const { selectedPage } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-auto"
              src="/img/horn_transparent.png"
              alt="Quirrel Logo"
            />
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <Link href="/activity">
                  <PillButton
                    title="Activity"
                    selected={selectedPage === "activity"}
                  />
                </Link>
                <Link href="/pending">
                  <PillButton
                    title="Pending"
                    selected={selectedPage === "pending"}
                  />
                </Link>

                <Link href="/cron">
                  <PillButton title="Cron" selected={selectedPage === "cron"} />
                </Link>
              </div>
            </div>
          </div>
          <div className="w-12">
            {/* This is a phantom object to make justify-between work*/}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-orange-500 hover:text-white hover:bg-orange-300 focus:outline-none focus:bg-orange-700 focus:text-white"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <svg
                className={clsx("h-6 w-6", isMenuOpen ? "hidden" : "block")}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={clsx("h-6 w-6", isMenuOpen ? "block" : "hidden")}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={clsx(isMenuOpen ? "block" : "hidden", "md:hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/activity">
            <MenuButton
              title="Activity"
              selected={selectedPage === "activity"}
            />
          </Link>

          <Link href="/pending">
            <MenuButton title="Pending" selected={selectedPage === "pending"} />
          </Link>

          <Link href="/cron">
            <MenuButton title="Cron" selected={selectedPage === "cron"} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
