using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cs_backend.Models
{
    public class Vastaus
    {
        [Key]
        public int id { get; set; }

        public int kysymys_id { get; set; }

        //[Column(TypeName = "nvarchar(250)")]
        public string vas_nimi { get; set; }

        public int pisteet { get; set; }

        public bool onko_oikein { get; set; }
    }
}
