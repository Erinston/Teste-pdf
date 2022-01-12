import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { format } from 'date-fns'


const instance = axios.create({
    baseURL: 'http://localhost:5000',
});

async function clientesPDF(clientes){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
     
    const cabecalho =  'Tascom Tecnologia                                                                  '
                    

    const data= format(new Date(), 'dd/MM/yyyy HH:MM')

                                                
    
    let patientData  = await instance.get("/api/attendances")
    console.log(patientData);
     
    
   // const marc_D_agua =  'Tascom Tecnologia';
      
    const tpRelatorio = [
        {
            table:{
            
                headerRows: 1,
                widths: ['*'],
                body: [
                    
                    [
                        {text: 'Relatorio Atendimento Por Período  - sem CID',  style: 'noBorders', fontSize: 10,alignment:'center' ,margin:[0,0,0,0]},
                    
                    ],

                ]
            },
            layout:'noBorders'
        }
    ];

    const filtro = [
        {
            table:{
               
                headerRows: 1,
                widths: ['*'],
                body: [
                    
                    [
                        {text: ' Periodo de  '+ data +' até '+ data+ ' | Convênio : * | Serviço= * ', fontSize: 10,alignment:'center' ,margin:[0,5,0,5] },
                      
                    ],
                ]
            },
            layout:'noBorders'
        }
    ];


    const dados = clientes.map((cliente) => {
        
            return [
                
                {text: cliente.cod_atend, fontSize: 8.2, margin: [0, 1, 0, 1]},
                {text: cliente.data_atend, fontSize: 8.2, margin: [0, 1, 0, 1]},
                {text: cliente.prestador, fontSize: 8.2, margin: [0, 1, 0, 1]},
                {text: cliente.paciente, fontSize: 8.2, margin: [0, 1, 0, 1]},
                {text: cliente.plano, fontSize: 8.2, margin: [0, 1, 0, 1]},
                {text: cliente.convenio, fontSize: 8.2, margin: [0, 1, 0, 1]},
               
            ]
        }
       
    );
    

    const details = [
        {
            table:{
                style:'tableExample',
                headerRows: 1,
                widths: [80, 80, 80, 80, 80, 80,],
                
                
                body: [
                    
                    [
                        {text: 'Atendimento', style: 'tableHeader', fontSize: 9},
                        {text: 'Data', style: 'tableHeader', fontSize: 9},
                        {text: 'Prestador', style: 'tableHeader', fontSize: 9},
                        {text: 'Paciente ', style: 'tableHeader', fontSize: 9},
                        {text: 'Plano  ', style: 'tableHeader', fontSize: 9},
                        {text: 'Convênio', style: 'tableHeader', fontSize: 9},
                        
                    ],
                    
                    ...dados
                     
                ]
            },
            layout: 'lightHorizontalLines',
           
            
        }
    ];
    var total =  [{  text: 'Total de Atendimentos:'+ dados.length , fontSize: 10,bold:true,  margin:[10,20,5,15] }]

    function Rodape(currentPage, pageCount){
        return [{text: currentPage + ' / ' + pageCount, alignment: 'right', fontSize: 9, margin: [0, , 10, 0] } ]
                                                                                        //Margin [ left, top, right, bottom ]
    }

    const docDefinitios = {
        pageSize: 'A4',
        pageMargins: [15, 55, 25, 40],
        FileName: 'Relatorio Atendimento Por Período',

       
        content: [ tpRelatorio , filtro ,details,total],
        header:function(currentPage, pageCount, pageSize) {
            // you can apply any logic and return any valid pdfmake element
            return [ 
                     {text: cabecalho + 'Paginas' + currentPage.toString() + '/' + pageCount +'                                                      '+'Emitido por:' + "Tom"+'\n'+'TSCM TECNOLOGIA'+'                                                                                                                                          '+' Em:' + data, style:'tableHeader',fontSize:  11  ,margin:[0,0,10,0] }, 
                        { canvas: [ { type: 'rect', x: 200, y: 40, w: pageSize.width - 200, h: 60 } ] },
                     ]    
                     
        },
    
       // watermark: { text: marc_D_agua, color: 'gray ', opacity: 0.1, bold: true, italics: false, fontSize: 50, angle: 0},
        footer: Rodape||  function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; } 
        
    }

    pdfMake.createPdf(docDefinitios).print();
}

export default clientesPDF;