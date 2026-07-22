"use client"

interface InputFieldProps {

  label:string

  value:string

  onChange:(value:string)=>void

}


export default function InputField({
  label,
  value,
  onChange
}:InputFieldProps){


return (

<div className="space-y-1">

<label
className="
text-sm
font-medium
text-gray-800
"
>
{label}
</label>

<input

value={value}

onChange={(e)=>
onChange(e.target.value)
}

className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
placeholder:text-gray-400
px-4
py-3
outline-none
focus:border-black
"

/>

</div>

)

}