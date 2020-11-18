using System;
using System.Collections.Generic;
using System.IO;
using Syncfusion.EJ2.PdfViewer;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;

namespace ApiRestContratos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfViewerController : ControllerBase
    {
        public IMemoryCache _cache;

        [Obsolete]
        public PdfViewerController(IHostingEnvironment hostingEnvironment, IMemoryCache cache)
        {
            _cache = cache;
        }

        [HttpPost]
        [Route("load")]
        //Post action for Loading the PDF documents   
        public ActionResult Load([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            MemoryStream stream = new MemoryStream();
            object jsonResult = new object();
            if (jsonObject != null && jsonObject.ContainsKey("document"))
            {
                if (bool.Parse(jsonObject["isFileName"]))
                {
                    string documentPath = GetDocumentPath(jsonObject["document"]);
                    if (!string.IsNullOrEmpty(documentPath))
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        stream = new MemoryStream(bytes);
                    }
                    else
                    {
                        return BadRequest(jsonObject["document"] + " is not found");
                    }
                }
                else
                {
                    byte[] bytes = Convert.FromBase64String(jsonObject["document"]);
                    stream = new MemoryStream(bytes);
                }
            }
            jsonResult = pdfviewer.Load(stream, jsonObject);
            return Ok(JsonConvert.SerializeObject(jsonResult));
        }

        [HttpPost]
        [Route("BookMarks")]
        //Post action for processing the bookmarks from the PDF documents   
        public ActionResult Bookmarks([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            var jsonResult = pdfviewer.GetBookmarks(jsonObject);
            return Ok(JsonConvert.SerializeObject(jsonResult));
        }

        [HttpPost]
        [Route("RenderPdfPages")]
        //Post action for processing the PDF documents.  
        public ActionResult RenderPdfPages([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object jsonResult = pdfviewer.GetPage(jsonObject);
            return Ok(JsonConvert.SerializeObject(jsonResult));
        }

        [HttpPost]
        [Route("RenderThumbnailImages")]
        //Post action for rendering the ThumbnailImages
        public ActionResult RenderThumbnailImages([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object result = pdfviewer.GetThumbnailImages(jsonObject);
            return Ok(JsonConvert.SerializeObject(result));
        }

        [HttpPost]
        [Route("Unload")]
        //Post action for unloading and disposing the PDF document resources  
        public ActionResult Unload([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            pdfviewer.ClearCache(jsonObject);
            return this.Ok("Document cache is cleared");
        }


        [HttpPost]
        [Route("Download")]
        //Post action for downloading the PDF documents
        public ActionResult Download([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            return Ok(documentBase);
        }

        [HttpPost]
        [Route("PrintImages")]
        //Post action for printing the PDF documents
        public ActionResult PrintImages([FromBody] Dictionary<string, string> jsonObject)
        {
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            object pageImage = pdfviewer.GetPrintImage(jsonObject);
            return Ok(JsonConvert.SerializeObject(pageImage));

        }
        //Gets the path of the PDF document
        private string GetDocumentPath(string document)
        {
            string documentPath = string.Empty;
            if (!System.IO.File.Exists(document))
            {
                var folderName = Path.Combine("Resources", "ArchivosPDF");
                var path = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathReturn = Path.Combine(path, document);

                if (System.IO.File.Exists(pathReturn))
                    documentPath = pathReturn;
            }
            else
            {
                documentPath = document;
            }
            return documentPath;
        }
    }
}