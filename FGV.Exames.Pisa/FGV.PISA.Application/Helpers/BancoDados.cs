using Dapper;
using System;
using System.Collections.Generic;

namespace FGV.PISA.Application.Helpers
{
    public class BancoDados
    {
        public static IEnumerable<DbString> GetAnsiStrings(List<string> strings)
        {
            strings = strings ?? throw new ArgumentNullException(nameof(strings));

            foreach (var ansiString in strings)
            {
                yield return new DbString { IsAnsi = true, Value = ansiString };
            }
        }
    }
}
