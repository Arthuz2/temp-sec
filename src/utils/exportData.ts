import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Temperature {
  data: string;
  valor: number;
}

interface DryingSession {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  duration: number;
  status: string;
}

export const exportToCSV = async (
  data: Temperature[],
  sessions: DryingSession[]
) => {
  try {
    // Corrigir datas
    const sessionsFormatted = sessions.map(session => ({
      ...session,
      startDate: new Date(session.startDate),
      endDate: new Date(session.endDate),
    }));

    let csvContent = 'RELATÓRIO DE MONITORAMENTO TEMPSEC\n';
    csvContent += `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}\n\n`;

    csvContent += '===============================\n';
    csvContent += '📊 Temperaturas Registradas\n';
    csvContent += '===============================\n';
    csvContent += 'Data/Hora,Temperatura (°C)\n';
    data.forEach(temp => {
      const formattedDate = format(new Date(temp.data), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
      csvContent += `${formattedDate},${temp.valor.toFixed(1)}\n`;
    });

    csvContent += '\n\n';
    csvContent += '===============================\n';
    csvContent += '🛠️ Sessões de Secagem\n';
    csvContent += '===============================\n';
    csvContent += 'ID,Data Início,Data Fim,Temp. Média (°C),Temp. Máx (°C),Temp. Mín (°C),Duração (min),Status\n';

    sessionsFormatted.forEach(session => {
      const start = format(session.startDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      const end = format(session.endDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      const status = session.status === 'completed' ? 'Concluída' : session.status === 'interrupted' ? 'Interrompida' : 'Em andamento';
      csvContent += `${session.id},${start},${end},${session.avgTemperature.toFixed(1)},${session.maxTemperature.toFixed(1)},${session.minTemperature.toFixed(1)},${session.duration},${status}\n`;
    });

    console.log(sessionsFormatted);
    console.log('CSV Content:', csvContent);

    // const fileName = `tempsec_dados_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;
    // const fileUri = FileSystem.documentDirectory + fileName;

    // await FileSystem.writeAsStringAsync(fileUri, csvContent, {
    //   encoding: FileSystem.EncodingType.UTF8,
    // });

    // if (await Sharing.isAvailableAsync()) {
    //   await Sharing.shareAsync(fileUri, {
    //     mimeType: 'text/csv',
    //     dialogTitle: 'Exportar dados TempSec',
    //   });
    // }

    // return { success: true, fileName };
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const generatePDFReport = async (
  data: Temperature[],
  sessions: DryingSession[]
) => {
  try {
    const sessionsFormatted = sessions.map(session => ({
      ...session,
      startDate: new Date(session.startDate),
      endDate: new Date(session.endDate),
    }));

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório TempSec</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f9f9f9; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
            th { background-color: #e9ecef; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
            .stat-card { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.1); border-radius: 8px; padding: 20px; width: 30%; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TempSec - Relatório de Monitoramento</h1>
            <p>Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
          
          <div class="section">
            <h2>Resumo Estatístico</h2>
            <div class="stats">
              <div class="stat-card">
                <h3>${Math.max(...data.map(t => t.valor)).toFixed(1)}°C</h3>
                <p>Temperatura Máxima</p>
              </div>
              <div class="stat-card">
                <h3>${Math.min(...data.map(t => t.valor)).toFixed(1)}°C</h3>
                <p>Temperatura Mínima</p>
              </div>
              <div class="stat-card">
                <h3>${(data.reduce((acc, t) => acc + t.valor, 0) / data.length).toFixed(1)}°C</h3>
                <p>Temperatura Média</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Sessões de Secagem</h2>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Duração</th>
                  <th>Temp. Média</th>
                  <th>Temp. Máx</th>
                  <th>Temp. Mín</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${sessionsFormatted.map(session => `
                  <tr>
                    <td>${format(session.startDate, 'dd/MM/yyyy', { locale: ptBR })}</td>
                    <td>${format(session.startDate, 'HH:mm')}</td>
                    <td>${format(session.endDate, 'HH:mm')}</td>
                    <td>${Math.floor(session.duration / 60)}h ${session.duration % 60}min</td>
                    <td>${session.avgTemperature.toFixed(1)}°C</td>
                    <td>${session.maxTemperature.toFixed(1)}°C</td>
                    <td>${session.minTemperature.toFixed(1)}°C</td>
                    <td>${session.status === 'completed' ? 'Concluída' : session.status === 'interrupted' ? 'Interrompida' : 'Em andamento'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const fileName = `tempsec_relatorio_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.html`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/html',
        dialogTitle: 'Exportar relatório TempSec',
      });
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return { success: false, error: (error as Error).message };
  }
};
