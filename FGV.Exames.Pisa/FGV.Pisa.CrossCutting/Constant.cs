using System;

namespace FGV.PISA.CrossCutting.Common
{
    public static class DateTimeBrasilia
    {
        public static DateTime Now() => TimeZoneInfo.ConvertTime(DateTime.Now, TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time"));
    }
}
