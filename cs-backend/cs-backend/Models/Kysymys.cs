using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cs_backend.Models
{
    public class Kysymys
    {
        [Key]
        public int id { get; set; }

        //[Column(TypeName = "nvarchar(250)")]
        public string kys_nimi { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        public int? tentti_id { get; set; }
    }
}
