//------------------------------------------------------------------------------
// <auto-generated>
//     Este código foi gerado via T4.
//
//     Alterações feitas neste arquivo podem ser perdidas
//     caso o código seja regerado. 
// </auto-generated>
//------------------------------------------------------------------------------
#region [ Diretivas de Using ]
using Dapper;
using FGV.PISA.Application.Common;
using FGV.PISA.Application.Helpers;
using FGV.PISA.Application.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
#endregion

namespace FGV.PISA.Application.DAL
{
    public class DALUsuario : IUsuario
	{
		IConfiguration _configuration;
	
		private static log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.Assembly.GetEntryAssembly().GetType());
	
		public DALUsuario(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public string GetConnection()
		{
			var connection = _configuration.GetSection("ConnectionString").GetSection("DefaultConnection").Value;
			return connection;
		}

		public string GetConnectionEnem()
		{
			var connection = _configuration.GetSection("ConnectionString").GetSection("DefaultConnectionEnem").Value;
			return connection;
		}

		public async Task<int> Create(Usuario usuario)
		{
			usuario.Ativo = true;
			try
			{
				var query = @" INSERT INTO [dbo].[Usuario](
													[Nome],
													[Cpf],
													[Email],
													[Telefone],
													[id_escola],
													[Senha],
													[DataCriacao],
													[DataAtualizacao],
													[Ativo])
													OUTPUT inserted.id
											VALUES (
													@Nome,
													@Cpf,
													@Email,
													@Telefone,
													@id_escola,
													@Senha,
													@DataCriacao,
													@DataAtualizacao,
													@Ativo)";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryAsync<int>(query, usuario);
					return model.FirstOrDefault();
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return -1;
			}

		}

		public async void Update(Usuario usuario)
		{
			usuario.DataAtualizacao = DateTime.Now;
			try
			{
				var query = @" UPDATE [dbo].[Usuario] SET 
													[Nome] = @Nome,
													[Cpf] = @Cpf,
													[Email] = @Email,
													[Telefone] = @Telefone,
													[id_escola] = @id_escola,
													[Senha] = @Senha,
													[DataCriacao] = @DataCriacao,
													[DataAtualizacao] = @DataAtualizacao,
													[Ativo] = @Ativo
											WHERE [Id] = @Id ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.ExecuteAsync(query, usuario);
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
				var query = @" UPDATE [dbo].[Usuario] SET 
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

		public async Task<Usuario> GetById(int Id)
		{
			try
			{
				var query = @" SELECT
									[Id],
									[Nome],
									[Cpf],
									[Email],
									[Telefone],
									[id_escola],
									[Senha],
									[DataCriacao],
									[DataAtualizacao],
									[Ativo]
								FROM [dbo].[Usuario]
								WHERE [Id] = @Id ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryFirstAsync<Usuario>(query, new {Id});
					return model;
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return null;
			}

		}

		public async Task<List<Usuario>> GetByEscola (int IdEscola)
		{
			try
			{
				var query = @" SELECT
									[Id],
									[Nome],
									[Cpf],
									[Email],
									[Telefone],
									[id_escola],
									[Senha],
									[DataCriacao],
									[DataAtualizacao],
									[Ativo]
								FROM [dbo].[Usuario]
								WHERE [IdEscola] = @IdEscola ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryAsync<Usuario>(query, new {IdEscola});
					return model.ToList();
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return null;
			}

		}

		public async Task<Usuario> GetHierarchy (int Id)
		{
			try
			{
				var query = @" SELECT
									[Usuario].[Id],
									[Usuario].[Nome],
									[Usuario].[Cpf],
									[Usuario].[Email],
									[Usuario].[Telefone],
									[Usuario].[id_escola],
									[Usuario].[Senha],
									[Usuario].[DataCriacao],
									[Usuario].[DataAtualizacao],
									[Usuario].[Ativo],
									[id_escola].[Id],
									[id_escola].[Codigo],
									[id_escola].[Nome],
									[id_escola].[DataCriacao],
									[id_escola].[DataAtualizacao],
									[id_escola].[Ativo]
								FROM [dbo].[Usuario]
								JOIN [dbo].[Escola] id_escola
								ON [dbo].[Usuario].[id_escola] = id_escola.[Id]
								WHERE [dbo].[Usuario].[Id]  = @Id ";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryAsync<Usuario,Escola,Usuario>(query,
															(Usuario,id_escola) => 
															{
																Usuario.Escola = id_escola;
																return Usuario;
															},
															new {Id });
					return model.FirstOrDefault();
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return null;
			}

		}


		public async Task<Usuario> Login(string cpf, string senha)
        {
			try
			{
				string criptographPassword = SecurityExtensions.GenerateSHA512String(senha);
				var query = @" SELECT
									[Id],
									[Nome],
									[Cpf],
									[Email],
									[Telefone],
									[id_escola],
									[Senha],
									[DataCriacao],
									[DataAtualizacao],
									[Ativo]
								FROM [dbo].[Usuario]
								WHERE [Cpf] = @cpf 
								and [Senha] = @senha";
				using (var sqlConnection = new SqlConnection(this.GetConnection()))
				{
					var model = await sqlConnection.QueryAsync<Usuario>(query, new {
						cpf = cpf, senha = criptographPassword
					});
					return model.FirstOrDefault();
				}

			}
			catch (Exception ex)
			{
				log.Error(ex);
				return null;
			}
		}

		public async Task<Usuario> LoginEnem(string cpf, string senha)
		{
			try
			{
				string criptographPassword = SecurityExtensions.GenerateSHA512String(senha);

				var query = @"SELECT u.* FROM usuarios u 
								INNER JOIN usuarios_funcoes uf ON u.id = uf.usuario_id 
								INNER JOIN funcoes f ON uf.funcao_id = f.id 
								WHERE u.cpf = @cpf AND u.senha = @senha AND f.id = 21 AND u.data_exclusao is null";

				//var query = @" SELECT
				//					[Id],
				//					[nome],
				//					[cpf],
				//					[email],
				//					[id_escola],
				//					[senha],
				//					[data_criacao],
				//					[data_alteracao],
				//					[data_exclusao]
				//				FROM [dbo].[usuarios]
				//				WHERE [cpf] = @cpf 
				//				and [Senha] = @senha";
				using (var sqlConnection = new SqlConnection(this.GetConnectionEnem()))
				{
					var model = await sqlConnection.QueryAsync<Usuario>(query, new
					{
						cpf = cpf,
						senha = criptographPassword
					});

					return model.FirstOrDefault();
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
