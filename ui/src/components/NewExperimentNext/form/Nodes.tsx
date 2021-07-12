import { AutocompleteMultipleField, TextField } from 'components/FormField'
import { Box, Button, Divider, Typography } from '@material-ui/core'
import { getIn, useFormikContext } from 'formik'
import { useStoreDispatch, useStoreSelector } from 'store'

import AddIcon from '@material-ui/icons/Add'
import Space from 'components-mui/Space'
import T from 'components/T'
import api from 'api'
import { getNodes } from 'slices/experiments'
import { setAlert } from 'slices/globalStatus'
import { useIntl } from 'react-intl'

const Nodes = () => {
  const intl = useIntl()
  const { values, errors, touched, setFieldValue } = useFormikContext()

  const { nodes } = useStoreSelector((state) => state.experiments)
  const dispatch = useStoreDispatch()

  const handleAddAddress = () => {
    const { name, address } = getIn(values, 'scope')

    api.nodes
      .add({
        name,
        kind: 'physic',
        config: btoa(address),
      })
      .then(() => {
        dispatch(
          setAlert({
            type: 'success',
            message: T('confirm.success.add', intl),
          })
        )

        dispatch(getNodes())
        setFieldValue('scope', {
          addresses: [...getIn(values, 'scope.addresses'), address],
          name: '',
          address: '',
        })
      })
      .catch(console.error)
  }

  return (
    <Space>
      <AutocompleteMultipleField
        name={'scope.addresses'}
        label={T('physic.select')}
        helperText={
          getIn(touched, 'scope.addresses') && getIn(errors, 'scope.addresses')
            ? getIn(errors, 'scope.addresses')
            : T(nodes.length === 0 ? 'physic.noAddress' : 'common.multiOptions')
        }
        options={nodes.map((n) => n.config)}
        error={getIn(errors, 'scope.addresses') && getIn(touched, 'scope.addresses') ? true : false}
        disabled={nodes.length === 0}
      />
      <Divider />
      <Typography>{T('physic.add')}</Typography>
      <TextField fast name="scope.name" label={T('common.name')} helperText={T('physic.nameHelper')} />
      <TextField fast name="scope.address" label={T('physic.address')} helperText={T('physic.addressHelper')} />
      <Box textAlign="right">
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAddress}>
          {T('common.add')}
        </Button>
      </Box>
    </Space>
  )
}

export default Nodes
