"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { BrowserMultiFormatReader } from "@zxing/browser"

import { buscarConfiguracaoPorId } from "@/lib/services/configuracoes"
import { criarInstalacao } from "@/lib/services/instalacoes"

import SectionTitle from "@/components/ui/SectionTitle"
import InputField from "@/components/ui/InputField"
import { buscarModelo } from "@/lib/services/modelos"
import ImeiInput from "@/components/ui/ImeiInput"
import CameraScanner from "@/components/ui/CameraScanner"

export default function NovaInstalacao(){

const [campoLeitura, setCampoLeitura] = useState<
"imei" | "imei_antigo" | "imei_novo" | null
>(null)

const router = useRouter()

const params = useSearchParams()


const configuracaoId =
params.get("config")
const modeloId =
params.get("modelo")



const [form,setForm] =
useState({

tipo_servico:"",
responsavel:"",

cliente:"",
telefone:"",
endereco:"",

marca:"",
modelo:"",
ano:"",
placa:"",
chassi:"",

imei:"",
imei_antigo:"",
imei_novo:"",

positivo:"",
negativo:"",
pos_chave:"",

anti_furto:false,

cor_corte:"",

local_instalacao:"",

observacoes:""

})





useEffect(()=>{


async function carregarConfiguracao(){


if(!configuracaoId)
return



try{


const configuracao =
await buscarConfiguracaoPorId(
configuracaoId
)
if(modeloId){

const modelo =
await buscarModelo(modeloId)


setForm(prev=>({

...prev,

marca:
modelo.marca || "",

modelo:
modelo.modelo || "",

ano:
modelo.ano || ""

}))

} 



setForm(prev=>({

...prev,

positivo:
configuracao.positivo || "",


negativo:
configuracao.negativo || "",


pos_chave:
configuracao.pos_chave || "",


anti_furto:
configuracao.anti_furto ?? false,


cor_corte:
configuracao.cor_corte || "",


local_instalacao:
configuracao.local_instalacao || "",


observacoes:
configuracao.observacoes || ""

}))



}catch(error){

console.error(
"Erro ao carregar configuração",
error
)

}


}


carregarConfiguracao()


},[configuracaoId])






function atualizar(
campo:string,
valor:string | boolean
){

setForm(prev=>({

...prev,

[campo]:valor

}))

}







async function salvar(){


try{


const resultado =
await criarInstalacao(form)



console.log(
"Instalação criada:",
resultado
)

alert(
"Instalação salva com sucesso!"
)

router.push("/")

router.refresh()


}catch(error){

console.error(error)

alert(
"Erro ao salvar instalação"
)

}

}

function abrirLeitor(
  campo: "imei" | "imei_antigo" | "imei_novo"
) {
  setCampoLeitura(campo)
}
return (

<main
className="
min-h-screen
bg-gray-50
p-4
pb-10
"
>


<h1
className="
text-2xl
font-bold
text-gray-900
"
>
Nova Instalação
</h1>


<p
className="
text-gray-500
mt-1
"
>
Registrar serviço realizado
</p>





<section
className="
mt-6
bg-white
rounded-2xl
p-5
"
>


<SectionTitle>
Configuração utilizada
</SectionTitle>



<div
className="
grid
gap-3
mt-3
"
>


<InputField

label="Positivo"

value={form.positivo}

onChange={(v)=>
atualizar(
"positivo",
v
)}

/>



<InputField

label="Negativo"

value={form.negativo}

onChange={(v)=>
atualizar(
"negativo",
v
)}

/>



<InputField

label="Pós-chave"

value={form.pos_chave}

onChange={(v)=>
atualizar(
"pos_chave",
v
)}

/>



<InputField

label="Local instalação"

value={form.local_instalacao}

onChange={(v)=>
atualizar(
"local_instalacao",
v
)}

/>



<InputField

label="Observações"

value={form.observacoes}

onChange={(v)=>
atualizar(
"observacoes",
v
)}

/>




<label
className="
flex
items-center
gap-3
mt-2
text-gray-700
"
>


<input

type="checkbox"

checked={form.anti_furto}

onChange={(e)=>
atualizar(
"anti_furto",
e.target.checked
)
}

/>


Possui anti-furto


</label>



</div>


</section>









<section
className="
mt-4
bg-white
rounded-2xl
p-5
"
>


<SectionTitle>
Dados do serviço
</SectionTitle>




<select

value={form.tipo_servico}

onChange={(e)=>
atualizar(
"tipo_servico",
e.target.value
)
}

className="
w-full
rounded-xl
border
border-gray-300
bg-white
text-gray-900
px-4
py-3
mt-3
"

>


<option value="">
Selecione o serviço
</option>


<option value="Instalação + bloqueio">
Instalação + bloqueio
</option>


<option value="Instalação">
Instalação
</option>


<option value="Manutenção">
Manutenção
</option>


<option value="Remoção">
Remoção
</option>


</select>





<InputField

label="Responsável"

value={form.responsavel}

onChange={(v)=>
atualizar(
"responsavel",
v
)}

/>





{
form.tipo_servico !== "Manutenção" && (


<ImeiInput
  label="IMEI"
  value={form.imei}
  onChange={(v) =>
    atualizar("imei", v)
  }
  onCamera={() => abrirLeitor("imei")}
/>

)

}






{
form.tipo_servico === "Manutenção" && (

<>


<ImeiInput
  label="IMEI antigo"
  value={form.imei_antigo}
  onChange={(v) =>
    atualizar("imei_antigo", v)
  }
  onCamera={() => abrirLeitor("imei_antigo")}
/>



<ImeiInput
  label="IMEI novo"
  value={form.imei_novo}
  onChange={(v) =>
    atualizar("imei_novo", v)
  }
  onCamera={() => abrirLeitor("imei_novo")}
/>


</>

)


}









{
form.tipo_servico === "Instalação + bloqueio" && (


<InputField

label="Cor de corte"

value={form.cor_corte}

onChange={(v)=>
atualizar(
"cor_corte",
v
)}

/>


)

}



</section>









<section
className="
mt-4
bg-white
rounded-2xl
p-5
"
>


<SectionTitle>
Dados do veículo
</SectionTitle>




<InputField

label="Cliente"

value={form.cliente}

onChange={(v)=>
atualizar(
"cliente",
v
)}

/>




<InputField

label="Telefone"

value={form.telefone}

onChange={(v)=>
atualizar(
"telefone",
v
)}

/>





<InputField

label="Endereço"

value={form.endereco}

onChange={(v)=>
atualizar(
"endereco",
v
)}

/>






<div
className="
grid
grid-cols-2
gap-3
"
>



<InputField

label="Marca"

value={form.marca}

onChange={(v)=>
atualizar(
"marca",
v
)}

/>




<InputField

label="Modelo"

value={form.modelo}

onChange={(v)=>
atualizar(
"modelo",
v
)}

/>




<InputField

label="Ano"

value={form.ano}

onChange={(v)=>
atualizar(
"ano",
v
)}

/>




<InputField

label="Placa"

value={form.placa}

onChange={(v)=>
atualizar(
"placa",
v
)}

/>


</div>





<InputField

label="Chassi"

value={form.chassi}

onChange={(v)=>
atualizar(
"chassi",
v
)}

/>



</section>








<button

onClick={salvar}

className="
mt-6
w-full
bg-black
text-white
py-4
rounded-2xl
font-semibold
text-lg
"

>

Salvar instalação

</button>




{campoLeitura && (

<CameraScanner

onClose={()=>
setCampoLeitura(null)
}

onResult={(codigo) => {

  atualizar(
    campoLeitura,
    codigo.replace(/\D/g, "")
  )

  setCampoLeitura(null)

}}

/>

)}

</main>

)

}