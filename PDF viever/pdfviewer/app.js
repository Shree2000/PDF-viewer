
//     /docs/pdf.pdf
//    /docs/pdf1.pdf
let pdfDoc= null, 
pageNum=1,
pageisrendering=false
pageNumIsPending= null;

let scale=1.5;

canvas= document.querySelector('#pdf-render');
ctx= canvas.getContext('2d');

const queueRenderPage=num=>{
    if(pageisrendering){
        pageNumIsPending=num;
    }else{
        renderPage(num);
    }
}
function increasesize(){
    if (scale> 4.5) return;
    scale+=0.5;
    renderPage(pageNum);
}
function decreasesize(){
    if(scale<=0.5)  return;
    scale-=0.5;
    renderPage(pageNum);
}
const showPrevPage=()=>{
if(pageNum<=1){
    return
}
pageNum--;
queueRenderPage(pageNum);
}

const showNextPage=()=>{
    if(pageNum>=pdfDoc.numPages){
        return
    }
    pageNum++;
    queueRenderPage(pageNum);
    }
    

const renderPage = num=>{
    pageisrendering=true;
    pdfDoc.getPage(num).then(data=>{
        const viewport= data.getViewport({scale});
        canvas.height= viewport.height;
        canvas.width=viewport.width;
        const renderCtx={
            canvasContext:ctx,
            viewport
        }
        data.render(renderCtx).promise.then(()=>{
            pageisrendering=false;
            if(pageNumIsPending!=null){
                renderPage(pageNumIsPending);
                pageisrendering=null;
            }
        });
        document.querySelector('#page-num').textContent=num;
     });
};

document.querySelector('.submit').addEventListener('click', ()=>{
    let url=document.querySelector('#input').value;
    pdfjsLib.getDocument(url).promise.then(pdfDoc1=>{
        pdfDoc=pdfDoc1;
        document.querySelector('#page-count').textContent= pdfDoc.numPages; 
        renderPage(pageNum);
    }).catch(error=>{
     alert('Something went wrong, Did you enter the correct URL?');
     console.log(error);
     
    })
    document.querySelector('#input').value='';
});
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
document.querySelector('.sizePlus').addEventListener('click', increasesize);
document.querySelector('.sizeMinus').addEventListener('click', decreasesize);
