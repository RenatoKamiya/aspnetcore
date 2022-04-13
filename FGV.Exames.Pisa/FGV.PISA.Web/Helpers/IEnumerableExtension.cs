using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FGV.PISA.Web.Helpers
{
    public static class IEnumerableExtension
    {
        public static IEnumerable<T> GetPaginated<T>(this IEnumerable<T> list, int skip, int pageSize)
        {
            return list.Skip(skip).Take(pageSize);
        }
        
    }
}
