const vereadoresObj = {
    votosTotal: 0,
    cores: [],
};

vereadores.forEach((vereador) => {
    console.log(vereador.fields)
    vereadoresObj.votosTotal += vereador.fields.votos;
    if (vereador.fields.partido == 'PMC') vereadoresObj.cores.push('#e23636');
    else if (vereador.fields.partido == 'PDC') vereadoresObj.cores.push('#0476f2');
    else vereadoresObj.cores.push('#adadad')
});

function seriesData(candidatos) {
    let data = [];
    candidatos.forEach((candidato) => {
        if (candidato.fields.nome.startsWith('Partido')) return
        data.push({
            name: candidato.fields.nome,
            y: (candidato.fields.votos/vereadoresObj.votosTotal)*100
        });
    });
    return data;
};

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        align: 'center',
        text: 'Resultado das eleições prara Vereador de Pythonville'
    },
    subtitle: {
        enabled: false
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Total percentual dos votos'
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
            },
            colors: vereadoresObj.cores,
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: ' +
            '<b>{point.y:.2f}%</b> of total<br/>'
    },

    series: [
        {
            name: 'Candidatos',
            colorByPoint: true,
            data: seriesData(vereadores)
        }
    ],
});
