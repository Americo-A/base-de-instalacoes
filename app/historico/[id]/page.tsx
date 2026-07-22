"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"

import {
 buscarHistoricoConfiguracao
} from "@/lib/services/historico"


import PageContainer from "@/components/layout/PageContainer"
import AppHeader from "@/components/layout/AppHeader"

import LoadingSkeleton from "@/components/ui/LoadingSkeleton"
import EmptyState from "@/components/ui/EmptyState"


interface Historico {

id:string

tipo_servico:string

responsavel:string

imei:string

created_at:string

veiculos:{
cliente:string
placa:string
marca:string
modelo:string
ano:string
}

}


export default function HistoricoPage(){

const params = useParams()


const [dados,setDados]=useState<Historico[]>([])

const [loading,setLoading]=useState(true)



useEffect(()=>{


async function carregar(){


try{


const resultado =
await buscarHistoricoConfiguracao(
params.id as string
)


setDados(resultado)


}catch(error){

console.error(error)

}
finally{

setLoading(false)

}


}


carregar()


},[params.id])





return (

<PageContainer>


<AppHeader

title="Histórico"

subtitle="Serviços realizados"

showBack

/>



{
loading && <LoadingSkeleton/>
}




{
!loading && dados.length===0 && (

<EmptyState

title="Nenhum histórico"

description="Ainda não existem serviços utilizando esta configuração."

/>

)

}




<div className="space-y-4">


{
dados.map(item=>(


<div

key={item.id}

className="
bg-white
rounded-2xl
p-5
shadow-sm
border
border-gray-200
"


>


<h3 className="
font-bold
text-gray-900
">

{item.tipo_servico}

</h3>



<p className="
text-sm
text-gray-700
mt-2
">

Cliente:
{item.veiculos?.cliente || "-"}

</p>


<p className="
text-sm
text-gray-700
">

Placa:
{item.veiculos?.placa || "-"}

</p>



<p className="
text-sm
text-gray-700
">

Responsável:
{item.responsavel || "-"}

</p>



</div>


))

}


</div>


</PageContainer>

)


}