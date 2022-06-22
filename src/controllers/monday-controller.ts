import mondayService from '../services/monday-service';
import TRANSFORMATION_TYPES from '../constants/transformation';
import transformationService from '../services/transformation-service';

export async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inboundFieldValues } = payload;
    const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inboundFieldValues;

    const text = await mondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }
    const transformedText = transformationService.transformText(
      text,
      transformationType ? transformationType.value : 'TO_UPPER_CASE'
    );

    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

export async function getRemoteListOptions(req, res) {
  try {
    return res.status(200).send(TRANSFORMATION_TYPES);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}

export async function setJobNumber(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;
  try {
    const { inputFields } = payload;
    const { boardId, itemId, columnId, jobId } = inputFields;

    const jobType = await mondayService.getColumnText(shortLivedToken, itemId, columnId);

    const joblist = await mondayService.queryboard(shortLivedToken, boardId, jobId);
    // var output = joblist.filter(x => x.column_values.text == 'OTO212'  );

    var output = joblist.filter(function(x){
      return x.column_values[0].text.startsWith(jobType);
    });
    
    var numberlist = output.map(function(el) {
      return el.column_values[0].text.replace(new RegExp("^" + jobType), '');
    });
    const newnum = Math.max(...numberlist)+1;
    const newJob = '"' + jobType + newnum + '"';

    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, jobId, newJob);

    await mondayService.changeColumnValue( shortLivedToken, boardId, itemId , 'status' ,"{\"index\": 1}" );
					
    
    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}
export async function setItemNumber(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;
  try {
    const { inputFields } = payload;
    const { boardId, itemId, columnId } = inputFields;

    // const jobType = await mondayService.getColumnText(shortLivedToken, itemId, columnId);
    const jobType = "prefix-";

    const joblist = await mondayService.queryboard(shortLivedToken, boardId, columnId);
    // var output = joblist.filter(x => x.column_values.text == 'OTO212'  );

    var output = joblist.filter(function(x){
      return x.column_values[0].text.startsWith(jobType);
    });
    
    var numberlist = output.map(function(el) {
      return el.column_values[0].text.replace(new RegExp("^" + jobType), '');
    });
    const newnum = Math.max(...numberlist)+1;
    const newJob = '"' + jobType + newnum + '"';

    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, columnId, newJob);

    // await mondayService.changeColumnValue( shortLivedToken, boardId, itemId , 'status' ,"{\"index\": 1}" );
					
    
    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'internal server error' });
  }
}
