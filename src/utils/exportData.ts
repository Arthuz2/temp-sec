import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ----------------- Tipos -----------------
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

// ----------------- Exportador CSV -----------------
export const exportToCSV = async (
  data: Temperature[],
  sessionDurationMinutes: number = 120
) => {
  try {
    const sessions = generateSessionsFromData(data, sessionDurationMinutes);

    const DELIM = ';';
    const EOL = '\r\n';

    // Formatacao numerica
    const fmtNumber = (n: number, digits = 1) =>
      n.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        useGrouping: false,
      });

    // Escapar valores para CSV
    const csvEscape = (value: unknown) => {
      const s = String(value ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
      return /[";,]/.test(s) ? `"${s}"` : s;
    };

    const row = (cols: unknown[]) => cols.map(csvEscape).join(DELIM) + EOL;

    // ---------- HEADER ----------
    let csv = '';
    csv += row(['RELATORIO DE MONITORAMENTO TEMPSEC']);
    csv += row([`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}`]);
    csv += EOL;

    // ---------- TEMPERATURAS ----------
    csv += row(['TEMPERATURAS REGISTRADAS']);
    csv += row(['Data_Hora', 'Temperatura_C']);
    for (const t of data) {
      const dt = format(new Date(t.data), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
      csv += row([dt, fmtNumber(t.valor)]);
    }
    csv += EOL;

    // ---------- SESSOES DE SECAGEM ----------
    csv += row(['SESSOES DE SECAGEM']);
    csv += row(['ID', 'Data_Inicio', 'Data_Fim', 'Temp_Media_C', 'Temp_Max_C', 'Temp_Min_C', 'Duracao_min', 'Status']);

    for (const s of sessions) {
      const start = format(new Date(s.startDate), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      const end = format(new Date(s.endDate), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      const status =
        s.status === 'completed'
          ? 'Concluida'
          : s.status === 'interrupted'
            ? 'Interrompida'
            : 'Em_andamento';

      csv += row([
        s.id,
        start,
        end,
        fmtNumber(s.avgTemperature),
        fmtNumber(s.maxTemperature),
        fmtNumber(s.minTemperature),
        s.duration,
        status,
      ]);
    }

    // ---------- SALVAR ----------
    const fileName = `tempsec_dados_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv; charset=utf-8',
        dialogTitle: 'Exportar dados TempSec',
      });
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return { success: false, error: (error as Error).message };
  }
};

// ----------------- Gerador de sessoes -----------------
const generateSessionsFromData = (
  temperatures: Temperature[],
  sessionDurationMinutes: number = 120
) => {
  if (!temperatures || temperatures.length === 0) return [];

  const sessions: DryingSession[] = [];
  const sortedTemps = [...temperatures].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  let currentSession: Temperature[] = [];
  let sessionId = 1;

  for (let i = 0; i < sortedTemps.length; i++) {
    const current = sortedTemps[i];
    const currentTime = new Date(current.data).getTime();

    if (currentSession.length === 0) {
      currentSession.push(current);
    } else {
      const lastTime = new Date(currentSession[currentSession.length - 1].data).getTime();
      const timeDiff = (currentTime - lastTime) / (1000 * 60 * 60);

      if (timeDiff > 2) {
        if (currentSession.length > 3) {
          const sessionTemps = currentSession.map((t) => t.valor);
          const startDate = new Date(currentSession[0].data);
          const endDate = new Date(currentSession[currentSession.length - 1].data);
          const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

          sessions.push({
            id: sessionId.toString(),
            startDate,
            endDate,
            avgTemperature:
              Math.round(
                (sessionTemps.reduce((a, b) => a + b, 0) / sessionTemps.length) * 10
              ) / 10,
            maxTemperature: Math.max(...sessionTemps),
            minTemperature: Math.min(...sessionTemps),
            duration,
            status: duration >= sessionDurationMinutes ? 'completed' : 'interrupted',
          });
          sessionId++;
        }
        currentSession = [current];
      } else {
        currentSession.push(current);
      }
    }
  }

  if (currentSession.length > 3) {
    const sessionTemps = currentSession.map((t) => t.valor);
    const startDate = new Date(currentSession[0].data);
    const endDate = new Date(currentSession[currentSession.length - 1].data);
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

    sessions.push({
      id: sessionId.toString(),
      startDate,
      endDate,
      avgTemperature:
        Math.round(
          (sessionTemps.reduce((a, b) => a + b, 0) / sessionTemps.length) * 10
        ) / 10,
      maxTemperature: Math.max(...sessionTemps),
      minTemperature: Math.min(...sessionTemps),
      duration,
      status: duration >= sessionDurationMinutes ? 'completed' : 'interrupted',
    });
  }

  return sessions.reverse();
};

export const generatePDFReport = async (
  data: Temperature[],
  sessionDurationMinutes: number = 120
) => {
  try {
    const sessions = generateSessionsFromData(data, sessionDurationMinutes);

    const maxTemp = data.length > 0 ? Math.max(...data.map(t => t.valor)) : 0;
    const minTemp = data.length > 0 ? Math.min(...data.map(t => t.valor)) : 0;
    const avgTemp = data.length > 0 ? data.reduce((acc, t) => acc + t.valor, 0) / data.length : 0;

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
            .session-status { padding: 4px 8px; border-radius: 4px; color: white; font-size: 12px; }
            .status-completed { background-color: #28a745; }
            .status-interrupted { background-color: #dc3545; }
            .status-active { background-color: #007bff; }
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
                <h3>${maxTemp.toFixed(1)}°C</h3>
                <p>Temperatura Máxima</p>
              </div>
              <div class="stat-card">
                <h3>${minTemp.toFixed(1)}°C</h3>
                <p>Temperatura Mínima</p>
              </div>
              <div class="stat-card">
                <h3>${avgTemp.toFixed(1)}°C</h3>
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
                ${sessions.length > 0 ? sessions.map(session => {
      const statusText = session.status === 'completed' ? 'Concluída' :
        session.status === 'interrupted' ? 'Interrompida' : 'Em andamento';
      const statusClass = session.status === 'completed' ? 'status-completed' :
        session.status === 'interrupted' ? 'status-interrupted' : 'status-active';
      return `
                    <tr>
                      <td>${format(session.startDate, 'dd/MM/yyyy', { locale: ptBR })}</td>
                      <td>${format(session.startDate, 'HH:mm')}</td>
                      <td>${format(session.endDate, 'HH:mm')}</td>
                      <td>${Math.floor(session.duration / 60)}h ${session.duration % 60}min</td>
                      <td>${session.avgTemperature.toFixed(1)}°C</td>
                      <td>${session.maxTemperature.toFixed(1)}°C</td>
                      <td>${session.minTemperature.toFixed(1)}°C</td>
                      <td><span class="session-status ${statusClass}">${statusText}</span></td>
                    </tr>
                  `;
    }).join('') : '<tr><td colspan="8">Nenhuma sessão de torra registrada</td></tr>'}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;


    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });

    const fileName = `tempsec_relatorio_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.pdf`;
    const pdfUri = `${FileSystem.documentDirectory}${fileName}`;


    await FileSystem.moveAsync({
      from: uri,
      to: pdfUri
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Exportar relatório TempSec PDF',
      });
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return { success: false, error: (error as Error).message };
  }
};
