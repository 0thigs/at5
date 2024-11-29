import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [consumptions, setConsumptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGender, setSelectedGender] = useState('');
  const [clientsMale, setClientsMale] = useState([]); 
const [clientsFemale, setClientsFemale] = useState([]); 


  const [mostConsumingClientsLimitTen, setMostConsumingClientsLimitTen] = useState([])
  const [leastConsumingClientsLimitTen, setLeastConsumingClientsLimitTen] = useState([])
  const [leastConsumingCLientsLimitFiveValor, setLeastConsumingClientsLimitFiveValor] = useState([])
  const [mostConsumedServices, setMostConsumedServices] = useState([])
  const [leastConsumedServices, setLeastConsumedServices] = useState([])
  const [listClientGender, setListClientGender] = useState([])
  const [mostConsumedServicesGender, setMostConsumedServicesGender] = useState([])
   const [mostConsumedServicesMale, setMostConsumedServicesMale] = useState([]); 
  const [mostConsumedServicesFemale, setMostConsumedServicesFemale] = useState([]); 


  const [showMostConsumingClientsLimitTen, setShowMostConsumingClientsLimitTen] = useState(false);
  const [showLeastConsumingClientsLimitTen, setShowLeastConsumingClientsLimitTen] = useState(false);
  const [showLeastConsumingClientsLimitFiveValor, setShowLeastConsumingClientsLimitFiveValor] = useState(false);
  const [showMostConsumedServices, setShowMostConsumedServices] = useState(false);
  const [showLeastConsumedServices, setShowLeastConsumedServices] = useState(false);
  const [showListClientGender, setShowListClientGender] = useState(false);
  const [showMostConsumedServicesGender, setShowMostConsumedServicesGender] = useState(false);
  const [showClientes, setShowClientes] = useState(false);
  const [showServicos, setShowServicos] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const baseURL = 'http://localhost:5000';

        const responseMale = await axios.get(`${baseURL}/clientes/por-genero/masculino`).catch(err => ({ data: [] }));
        const responseFemale = await axios.get(`${baseURL}/clientes/por-genero/feminino`).catch(err => ({ data: [] }));

        const responseMaleService = await axios.get(`${baseURL}/servicos/mais-consumidos-por-genero/masculino`);
        const responseFemaleService = await axios.get(`${baseURL}/servicos/mais-consumidos-por-genero/feminino`);

        const responses = await Promise.all([
          axios.get(`${baseURL}/clientes`).catch(err => ({ data: [] })),
          axios.get(`${baseURL}/servicos`).catch(err => ({ data: [] })),
          axios.get(`${baseURL}/clientes/top-10-consumo`).catch(err => ({ data: [] })),
          axios.get(`${baseURL}/clientes/menos-consumo`).catch(err => ({ data: [] })),
          axios.get(`${baseURL}/clientes/top5-consumo-valor`).catch(err => ({ data: [] })),
          axios.get(`${baseURL}/servicos/mais-consumidos`).catch(err => ({ data: [] })),
          axios.get(`${baseURL}/servicos/menos-consumidos`).catch(err => ({ data: [] })),
          selectedGender ? axios.get(`${baseURL}/clientes/por-genero/${selectedGender}`).catch(err => ({ data: [] })) : Promise.resolve({ data: [] }),
          selectedGender ? axios.get(`${baseURL}/servicos/mais-consumidos-por-genero/${selectedGender}`).catch(err => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);
    
        const [
          clientsRes,
          servicesRes,
          topConsumersRes,
          bottomConsumersRes,
          topValueConsumersRes,
          mostConsumedRes,
          leastConsumedRes,
          setMostConsumedServicesGenderRes,
          clientsByGenderRes,
          servicesByGenderRes
        ] = responses;

      console.log('Most Consumed Services Gender Response:', setMostConsumedServicesGenderRes.data);
    
      setClientsMale(responseMale.data || []);
      setClientsFemale(responseFemale.data || []);

      setMostConsumedServicesMale(responseMaleService.data || []);
      setMostConsumedServicesFemale(responseFemaleService.data || []);

        setClients(clientsRes.data || []);
        setServices(servicesRes.data || []);
        setMostConsumingClientsLimitTen(topConsumersRes.data.map(item => ({
          id: item.ClienteId,
          name: item.Cliente.nome,
          totalConsumptions: parseInt(item.totalConsumo)
        })) || []);
        setLeastConsumingClientsLimitTen(bottomConsumersRes.data.map(item => ({
          id: item.ClienteId,
          name: item.Cliente.nome,
          totalConsumptions: parseInt(item.totalConsumo)
        })) || []);
        setLeastConsumingClientsLimitFiveValor(topValueConsumersRes.data.map(item => ({
          id: item.id,
          name: item.nome,
          totalValue: parseFloat(item.totalGasto)
        })) || []);
        setMostConsumedServices(mostConsumedRes.data.map(item => ({
          id: item.ServicoId,
          name: item.nome,
          totalConsumptions: parseInt(item.totalConsumo)
        })) || []);
        setLeastConsumedServices(leastConsumedRes.data.map(item => ({
          id: item.ServicoId,
          name: item.nome,
          totalConsumptions: parseInt(item.totalConsumo)
        })) || []);
        setListClientGender(clientsByGenderRes.data.map(item => ({
          id: item.ClienteId,
          name: item.nome,
          gender: item.genero
        })) || []);
        setMostConsumedServicesGender(setMostConsumedServicesGenderRes.data.map(item => ({
          id: item.ServicoId, 
          name: item.nomeServico, 
          totalConsumptions: item.totalConsumo
        })) || []);

        setMostConsumedServicesMale(responseMaleService.data.map(item => ({
          name: item.nomeServico, 
          totalConsumptions: item.totalConsumo 
        })) || []);

        setMostConsumedServicesFemale(responseFemaleService.data.map(item => ({
          name: item.nomeServico, 
          totalConsumptions: item.totalConsumo 
        })) || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData()
  }, [selectedGender]) 

  const addClient = async (newClient) => {
    try {
      const response = await axios.post('http://localhost:5000/clientes', newClient)
      setClients(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data])
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Error adding client. Please try again.')
    }
  }

  const addService = async (newService) => {
    try {
      const response = await axios.post('http://localhost:5000/servicos', newService)
      setServices(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data])
    } catch (error) {
      console.error('Error adding service:', error)
      alert('Error adding service. Please try again.')
    }
  }

  const addConsumption = async (newConsumption) => {
    try {
      console.log('Enviando dados de consumo:', newConsumption);
  
      const response = await axios.post('http://localhost:5000/api/consumos', {
        clienteId: parseInt(newConsumption.clienteId),
        servicoId: parseInt(newConsumption.servicoId)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Resposta:', response.data);
  
      if (response.data && response.data.id) {
        setConsumptions((prev) => [...prev, response.data]); 
        alert('Consumo registrado com sucesso!');
      } else {
        throw new Error('Resposta inválida do servidor');
      }
  
    } catch (error) {
      console.error('Erro ao registrar consumo:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('Erro ao registrar consumo. Por favor, tente novamente.');
    }
  };
  
{mostConsumingClientsLimitTen.map((client, index) => (
  <div key={client.id}>
   {index + 1}. {client.name} - {client.totalConsumptions} consumptions
  </div>
))}

{leastConsumingClientsLimitTen.map((client, index) => (
  <div key={client.id}>
    {index + 1}. {client.name} - {client.totalConsumptions} consumptions
  </div>
))}

{leastConsumingCLientsLimitFiveValor.map((client, index) => (
  <div key={client.id}>
    {index + 1}. {client.name} - ${client.totalValue.toFixed(2)} in value
  </div>
))}

{mostConsumedServices.map((service, index) => (
  <div key={service.id}>
    {mostConsumedServices.length}. {service.name} - {service.totalConsumptions} consumptions
  </div>
))}

{leastConsumedServices.map((service, index) => (
  <div key={service.id}>
    {leastConsumedServices.length}. {service.name} - {service.totalConsumptions} consumptions
  </div>
))}

{mostConsumedServicesGender
  .filter(service => service.gender === selectedGender)
  .map((service, index) => (
    <div key={service.id}>
      {index + 1}. {service.name} - {service.totalConsumptions} consumptions ({selectedGender})
    </div>
  ))}


{listClientGender
  .filter(client => client.gender === selectedGender)
  .map((client, index) => (
    <div key={client.id}>
      {index + 1}. {client.name} - {client.gender}
    </div>
  ))}

  if (loading) {
    return <div>Carregando dados...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  return (
    <div className="container p-4 mx-auto">
      <h1>Empresa Thigszin</h1>

      <h2>Cadastro de Cliente</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          console.log(e.target)
          addClient({
            nome: e.target.name.value,
            genero: e.target.genero.value,
            socialName: e.target.socialName.value,
            rg: e.target.rg.value,
            rgIssueDate: e.target.rgIssueDate.value,
            cpf: e.target.cpf.value,
            cpfIssueDate: e.target.cpfIssueDate.value,
            telefone: e.target.phone.value
          })
          e.target.reset()
        }}
      >
        <label>
          Nome:
          <input type="text" name="name" required />
        </label>
         
        <label>
          Gênero:
          <select name="genero" required>
            <option value="masculino">masculino</option>
            <option value="feminino">feminino</option>
          </select>
        </label>

        <label>
          Nome social:
          <input type="text" name="socialName" />
        </label>
        <label>
          RG:
          <input type="text" name="rg" required />
          Data de emissão:
          <input type="date" name="rgIssueDate" required />
        </label>
        <label>
          CPF:
          <input type="text" name="cpf" required />
          Data de emissão:
          <input type="date" name="cpfIssueDate" required />
        </label>
        <label>
          Telefone:
          <input type="tel" name="phone" required />
        </label>
        <button type="submit">Adicionar Cliente</button>
      </form>

      <h2>Cadastro de Serviço</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addService({
            nome: e.target.name.value,
            valor: parseFloat(e.target.value.value)
          })
          e.target.reset()
        }}
      >
        <label>
          Nome do Serviço:
          <input type="text" name="name" required />
        </label>
        <label>
          Valor do Serviço:
          <input type="number" name="value" required step="0.01" min="0" />
        </label>
        <button type="submit">Adicionar Serviço</button>
      </form>

      Área de Consumo
      <h2>Registrar Consumo</h2>
      {clients.length === 0 || services.length === 0 ? (
        <p>É necessário cadastrar clientes e serviços antes de registrar consumos.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addConsumption({
              clienteId: e.target.clientName.value,
              servicoId: e.target.serviceName.value
            })
            e.target.reset()
          }}
        >
          <label>
            Cliente:
            <select name="clientName" required>
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Serviço:
            <select name="serviceName" required>
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nome}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Registrar Consumo</button>
        </form>
      )}

<div>
  <div className="flex gap-4 items-center mb-4">
    <h2>Clientes Cadastrados</h2>
    <button 
      onClick={() => setShowClientes(!showClientes)}
      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showClientes ? 'Ocultar' : 'Mostrar'} Clientes
    </button>
  </div>

  {showClientes && (
    clients.length === 0 ? (
      <p>Nenhum cliente cadastrado.</p>
    ) : (
      <table className="min-w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300">Genero</th>
            <th className="p-2 border border-gray-300">Nome</th>
            <th className="p-2 border border-gray-300">Nome Social</th>
            <th className="p-2 border border-gray-300">RG</th>
            <th className="p-2 border border-gray-300">Data de Emissão RG</th>
            <th className="p-2 border border-gray-300">CPF</th>
            <th className="p-2 border border-gray-300">Data de Emissão CPF</th>
            <th className="p-2 border border-gray-300">Telefone</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="p-2 border border-gray-300">{client.genero}</td>
              <td className="p-2 border border-gray-300">{client.nome}</td>
              <td className="p-2 border border-gray-300">{client.socialName}</td>
              <td className="p-2 border border-gray-300">{client.rg}</td>
              <td className="p-2 border border-gray-300">{client.rgIssueDate}</td>
              <td className="p-2 border border-gray-300">{client.cpf}</td>
              <td className="p-2 border border-gray-300">{client.cpfIssueDate}</td>
              <td className="p-2 border border-gray-300">{client.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  )}
</div>

<div className="mt-8">
  <div className="flex gap-4 items-center mb-4">
    <h2>Serviços Cadastrados</h2>
    <button 
      onClick={() => setShowServicos(!showServicos)}
      className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showServicos ? 'Ocultar' : 'Mostrar'} Serviços
    </button>
  </div>

  {showServicos && (
    services.length === 0 ? (
      <p>Nenhum serviço cadastrado.</p>
    ) : (
      <table className="min-w-full border border-gray-300 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300">Nome do Serviço</th>
            <th className="p-2 border border-gray-300">Valor do Serviço</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td className="p-2 border border-gray-300">{service.nome}</td>
              <td className="p-2 border border-gray-300">{service.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  )}
</div>
      

<div>
  <h2>Análise</h2>

  <div>
    <h2>Clientes por Gênero</h2>
    <button 
      onClick={() => setShowListClientGender(!showListClientGender)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showListClientGender ? 'Ocultar' : 'Mostrar'} Clientes por Gênero
    </button>
    
    {showListClientGender && (
      <>
        <div>
          <h3>Clientes Masculinos</h3>
          <ul>
            {clientsMale.length > 0 ? (
              clientsMale.map((client) => (
                <li key={client.id}>
                  {client.nome} - {client.totalConsumptions} consumos
                </li>
              ))
            ) : (
              <p>Nenhum cliente masculino encontrado.</p>
            )}
          </ul>
        </div>

        <div>
          <h3>Clientes Femininos</h3>
          <ul>
            {clientsFemale.length > 0 ? (
              clientsFemale.map((client) => (
                <li key={client.id}>
                  {client.nome} - {client.totalConsumptions} consumos
                </li>
              ))
            ) : (
              <p>Nenhum cliente feminino encontrado.</p>
            )}
          </ul>
        </div>
      </>
    )}
  </div>

  <div>
    <button 
      onClick={() => setShowMostConsumingClientsLimitTen(!showMostConsumingClientsLimitTen)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showMostConsumingClientsLimitTen ? 'Ocultar' : 'Mostrar'} Top 10 Maiores Consumidores
    </button>
    
    {showMostConsumingClientsLimitTen && (
      <>
        <h3>1. Listagem dos 10 clientes que mais consumiram serviços em quantidade:</h3>
        <ul>
          {mostConsumingClientsLimitTen.map((client, index) => (
            <li key={client.id}>
              {index + 1}. {client.name} - {client.totalConsumptions} consumos
            </li>
          ))}
        </ul>
      </>
    )}
  </div>

  <div>
    <button 
      onClick={() => setShowLeastConsumingClientsLimitTen(!showLeastConsumingClientsLimitTen)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showLeastConsumingClientsLimitTen ? 'Ocultar' : 'Mostrar'} Top 10 Menores Consumidores
    </button>
    
    {showLeastConsumingClientsLimitTen && (
      <>
        <h3>2. Listagem dos 10 clientes que menos consumiram serviço:</h3>
        <ul>
          {leastConsumingClientsLimitTen.map((client, index) => (
            <li key={client.id}>
              {index + 1}. {client.name} - {client.totalConsumptions} consumos
            </li>
          ))}
        </ul>
      </>
    )}
  </div>

  <div>
    <button 
      onClick={() => setShowLeastConsumingClientsLimitFiveValor(!showLeastConsumingClientsLimitFiveValor)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showLeastConsumingClientsLimitFiveValor ? 'Ocultar' : 'Mostrar'} Top 5 por Valor
    </button>
    
    {showLeastConsumingClientsLimitFiveValor && (
      <>
        <h3>3. 5 clientes que mais consumiram em valor:</h3>
        <ul>
          {leastConsumingCLientsLimitFiveValor.map((client, index) => (
            <li key={client.id}>
              {index + 1}. {client.name} - ${client.totalValue.toFixed(2)} em valor
            </li>
          ))}
        </ul>
      </>
    )}
  </div>

  <div>
    <button 
      onClick={() => setShowLeastConsumedServices(!showLeastConsumedServices)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showLeastConsumedServices ? 'Ocultar' : 'Mostrar'} Serviços Menos Consumidos
    </button>
    
    {showLeastConsumedServices && (
      <>
        <h3>4. Listagem dos serviços menos consumidos:</h3>
        <ul>
          {leastConsumedServices.map((service, index) => (
            <li key={service.id}>
              {index + 1}. {service.name} - {service.totalConsumptions} consumos
            </li>
          ))}
        </ul>
      </>
    )}
  </div>

  <div>
    <button 
      onClick={() => setShowMostConsumedServices(!showMostConsumedServices)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showMostConsumedServices ? 'Ocultar' : 'Mostrar'} Serviços Mais Consumidos
    </button>
    
    {showMostConsumedServices && (
      <>
        <h3>5. Lista dos serviços mais consumidos:</h3>
        <ul>
          {mostConsumedServices.map((service, index) => (
            <li key={service.id}>
              {index + 1}. {service.name} - {service.totalConsumptions} consumos
            </li>
          ))}
        </ul>
      </>
    )}
  </div>

  <div>
    <button 
      onClick={() => setShowMostConsumedServicesGender(!showMostConsumedServicesGender)}
      className="px-4 py-2 mb-2 text-white bg-blue-500 rounded hover:bg-blue-600"
    >
      {showMostConsumedServicesGender ? 'Ocultar' : 'Mostrar'} Serviços por Gênero
    </button>
    
    {showMostConsumedServicesGender && (
      <>
        <h3>6. Lista dos serviços mais consumidos por gênero:</h3>
        
        <div>
          <h4>Masculino:</h4>
          <ul>
            {mostConsumedServicesMale.length === 0 ? (
              <p>Nenhum serviço encontrado para clientes masculinos.</p>
            ) : (
              mostConsumedServicesMale.map((service, index) => (
                <li key={service.id}>
                  {index + 1}. {service.name} - {service.totalConsumptions} consumos (Masculino)
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h4>Feminino:</h4>
          <ul>
            {mostConsumedServicesFemale.length === 0 ? (
              <p>Nenhum serviço encontrado para clientes femininos.</p>
            ) : (
              mostConsumedServicesFemale.map((service, index) => (
                <li key={service.id}>
                  {index + 1}. {service.name} - {service.totalConsumptions} consumos (Feminino)
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    )}
  </div>
</div>
</div>
    )
  }
export default App