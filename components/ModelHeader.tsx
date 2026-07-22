interface Props{

modelo:any

}


export default function ModelHeader({
modelo
}:Props){


return (

<div>


<h1 className="
text-3xl
font-bold
">

{modelo?.marca}

{" "}

{modelo?.modelo}

</h1>


<p className="
text-gray-500
text-lg
">

Ano {modelo?.ano}

</p>



<p className="
mt-3
text-sm
text-gray-400
">

Configurações conhecidas

</p>


</div>

)

}