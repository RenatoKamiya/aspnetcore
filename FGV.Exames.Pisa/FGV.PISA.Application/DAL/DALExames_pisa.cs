//------------------------------------------------------------------------------
// <auto-generated>
//     Este código foi gerado via T4.
//
//     Alterações feitas neste arquivo podem ser perdidas
//     caso o código seja regerado. 
// </auto-generated>
//------------------------------------------------------------------------------
#region [ Diretivas de Using ]
using FGV.PISA.Application.Common;
using Dapper;
using Microsoft.Extensions.Configuration;
using FGV.PISA.Application.Model;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
#endregion

namespace FGV.PISA.Application.DAL
{
	public class DALExames_pisa : IExames_pisa
	{
		IConfiguration _configuration;
	
		private static log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.Assembly.GetEntryAssembly().GetType());
	
		public DALExames_pisa(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public string GetConnection()
		{
			var connection = _configuration.GetSection("ConnectionString").GetSection("DefaultConnection").Value;
			return connection;
		}

		public async Task<int> Create(Exames_pisa exames_pisa)
		{
			exames_pisa.Ativo = true;
			try
			{
				var query = @" INSERT INTO [dbo].[Exames_pisa](
													[Descricao],
													[Ano],
													[DataCriacao],
													[DataAtualizacao],
													[Ativo])
													OUTPUT inserted.id
											VALUES (
													@Descricao,
													@Ano,
													@DataCriacao,
													@DataAtualizacao,
													@Ativo)";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryAsync<int>(query, exames_pisa);
					return model.FirstOrDefault();
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return -1;
			}

		}

		public async void Update(Exames_pisa exames_pisa)
		{
			exames_pisa.DataAtualizacao = DateTime.Now;
			try
			{
				var query = @" UPDATE [dbo].[Exames_pisa] SET 
													[Descricao] = @Descricao,
													[Ano] = @Ano,
													[DataCriacao] = @DataCriacao,
													[DataAtualizacao] = @DataAtualizacao,
													[Ativo] = @Ativo
											WHERE [Id] = @Id ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.ExecuteAsync(query, exames_pisa);
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
			}

		}

		public async void Delete(int Id)
		{
			try
			{
				var query = @" UPDATE [dbo].[Exames_pisa] SET 
													[Ativo] =  0
											WHERE [Id] = @Id ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.ExecuteAsync(query, new {Id});
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
			}

		}

		public async Task<Exames_pisa> GetById(int Id)
		{
			try
			{
				var query = @" SELECT
									[id],
									[Descricao],
									[Ano],
									[DataCriacao],
									[DataAtualizacao],
									[Ativo]
								FROM [dbo].[Exames_pisa]
								WHERE [Id] = @Id ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryFirstAsync<Exames_pisa>(query, new {Id});
					return model;
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return null;
			}

		}
		public async Task<List<Exames_pisa>> GetALL()
		{
			try
			{
				var query = @" SELECT
									[id],
									[Descricao],
									[Ano],
									[DataCriacao],
									[DataAtualizacao],
									[Ativo]
								FROM [dbo].[Exames_pisa]
								WHERE [Ativo] = 1 ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryAsync<Exames_pisa>(query);
					return model.ToList();
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return null;
			}

		}
	}

}
