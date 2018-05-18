using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace crawler_app.Pages
{
    public class Results
    {
        public string URL { get; set; }
        public string Keyword { get; set; }
        public string CrawlMethod { get; set; }
        public int Limit { get; set; }
    }

    public class ResultsModel : PageModel
    {

        [BindProperty]
        public Results results { get; set; }

        public void OnGet()
        {
            Results r = new Results();
            r.URL = string.IsNullOrEmpty(HttpContext.Request.Query["url"].ToString()) ? "" : HttpContext.Request.Query["url"].ToString();
            r.Keyword = string.IsNullOrEmpty(HttpContext.Request.Query["keyword"].ToString()) ? "" : HttpContext.Request.Query["keyword"].ToString();
            r.CrawlMethod = string.IsNullOrEmpty(HttpContext.Request.Query["method"].ToString()) ? "" : HttpContext.Request.Query["method"].ToString();
            r.Limit = string.IsNullOrEmpty(HttpContext.Request.Query["limit"].ToString()) ? 0 : int.Parse(HttpContext.Request.Query["limit"].ToString());
            results = r;
        }
        
    }
}