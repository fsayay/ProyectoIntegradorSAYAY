using ApiRestContratos.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiRestContratos.DataStorage
{
    public static class DataManager
    {
        public static List<ChartModel> GetData()
        {
            var r = new Random();
            return new List<ChartModel>
            {
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Bienes"},
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Servicios"},
                new ChartModel { Data = new List<int> { r.Next(1, 40) }, Label = "Obras"}
            };
        }
    }
}
