interface Props {
  children: React.ReactNode
}


export default function SectionTitle({
  children
}: Props) {


return (

<h2
className="
text-lg
font-bold
text-gray-900
mb-2
"
>
{children}
</h2>

)

}