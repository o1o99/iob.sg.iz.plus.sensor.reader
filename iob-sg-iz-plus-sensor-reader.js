/*
  Ein Script welches bekannte Werte in
  Datenpunkte im Aliasbereich schreibt.
  Datenpunkte werden bei Bedarf erstell!
  SmartGas Impulszähler: SG-IZ-Plus-BK

  source: https://github.com/o1o99/iob.sg.iz.plus.sensor.reader

*/

// TODO: Name anpassen
const jsonObjId = 'mqtt.0.SmartGas-XXX.tele.SENSOR';
 
const rootId = '0_userdata.0.Verbrauchszaehler.Gas';

const datapointIds = [
  'gas_counter',
  'current_kw',
  'current_m3h',
  'total_cost',
  'today_consumption_m3',
  'today_cost',
  'today_base_cost',
  'month_consumption_m3',
  'month_cost',
  'month_base_cost',
  'year_consumption_m3',
  'year_cost',
  'year_base_cost',
  'today_consumption_kwh',
  'month_consumption_kwh',
  'year_consumption_kwh',
  'gas_price_m3'
];


function setStateSafe(rootId, id, value, ack = false) {
const newId = `${rootId}.${id}`;    
if (!existsState(newId)) {
  createState(newId, 0, {
    name: id,
    type: 'number',
    role: 'value',
    read: true,
    write: false
  }, () => {
    setState(newId, value, ack);
  });
    log("Datenpunkt '" + id + "' wurde erstellt und gesetzt", "info");
} else {
    setState(newId, value, ack);
}
}
 
on({ id: jsonObjId, change: 'ne' }, (dp) => {
try { 
  const obj = JSON.parse(dp.state.val);
  for (const dpId of datapointIds)
  {
    const value = obj[dpId];
    if (value != null)
    {
      setStateSafe(rootId, dpId, value, true);
    } else  {       
      setStateSafe(rootId, dpId, 0, true);  
      log("Id '" + dpId + "' hat keinen Wert!", "debug");
    }     
  }
    log("gas_counter: " + obj.gas_counter + " current_kw: " + obj.current_kw, "debug");
  } catch (e) {
    log("Datenpunkt '" + jsonObjId + "' konnte nicht eingelesen werden!", "warn");     
    return;
  }    
});
