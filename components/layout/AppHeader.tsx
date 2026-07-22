"use client"

import { ArrowLeft, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

interface AppHeaderProps {
  title: string
  subtitle?: string
  showMenu?: boolean
  showBack?: boolean
  onMenuClick?: () => void
  align?: "left" | "center"
}

export default function AppHeader({
  title,
  subtitle,
  showMenu = false,
  showBack = false,
  onMenuClick,
  align = "left",
}: AppHeaderProps) {

  const router = useRouter()


  return (

    <header className="relative mb-8">


      {(showMenu || showBack) && (

        <div className="absolute top-0 right-0">

          <button
            onClick={() => {

              if (showBack) {

                router.back()

              } else {

                onMenuClick?.()

              }

            }}

            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              bg-white
              border
              border-gray-200
              shadow-sm
              text-gray-900
              active:scale-95
              transition-all
            "
          >

            {showBack ? (

              <ArrowLeft
                size={22}
                className="text-gray-900"
              />

            ) : (

              <Menu
                size={22}
                className="text-gray-900"
              />

            )}

          </button>

        </div>

      )}



      <div

        className={`
          ${showMenu || showBack ? "pr-14" : ""}
          ${align === "center" ? "text-center" : "text-left"}
        `}

      >


        {title && (

          <h1

            className="
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
              leading-tight
            "

          >

            {title}

          </h1>

        )}



        {subtitle && (

          <p

            className="
              mt-2
              text-gray-500
              text-base
            "

          >

            {subtitle}

          </p>

        )}


      </div>


    </header>

  )
}