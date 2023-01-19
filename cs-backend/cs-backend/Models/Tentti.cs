using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cs_backend.Models
{
    public class Tentti
    {
        [Key]
        public int id { get; set; }

        //[Column(TypeName = "nvarchar(250)")]
        public string ten_nimi { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        public DateTime? tentti_pvm { get; set; }

        public int? min_pisteet { get; set; }
    }
}