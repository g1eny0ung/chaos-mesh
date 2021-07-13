import { AutocompleteMultipleField, TextField } from 'components/FormField'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { getIn, useFormikContext } from 'formik'
import { setAlert, setConfirm } from 'slices/globalStatus'
import { useStoreDispatch, useStoreSelector } from 'store'

import AddIcon from '@material-ui/icons/Add'
import ConfirmDialog from 'components-mui/ConfirmDialog'
import { Node } from 'api/nodes'
import Space from 'components-mui/Space'
import T from 'components/T'
import api from 'api'
import { getNodes } from 'slices/experiments'
import { useIntl } from 'react-intl'
import { useState } from 'react'

const Nodes = () => {
  const intl = useIntl()
  const { values, errors, touched, setFieldValue } = useFormikContext()

  const { nodes } = useStoreSelector((state) => state.experiments)
  const dispatch = useStoreDispatch()

  const [open, setOpen] = useState(false)

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

  const handleRemoveNode =
    ({ name, config }: Node) =>
    () => {
      dispatch(
        setConfirm({
          title: `${T('common.delete', intl)} ${name}`,
          handle: () => {
            api.nodes
              .del(name)
              .then(() => {
                dispatch(
                  setAlert({
                    type: 'success',
                    message: T('confirm.success.delete', intl),
                  })
                )

                if (nodes.length === 1) {
                  setOpen(false)
                }

                const current = getIn(values, 'scope.addresses')
                if (current.includes(config)) {
                  setFieldValue(
                    'scope.addresses',
                    current.filter((d: string) => d !== config)
                  )
                }

                dispatch(getNodes())
              })
              .catch(console.error)
          },
        })
      )
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
      <Space direction="row" justifyContent="end">
        {nodes.length > 0 && <Button onClick={() => setOpen(true)}>{T('physic.manage')}</Button>}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAddress}>
          {T('common.add')}
        </Button>
      </Space>
      <ConfirmDialog
        open={open}
        title={T('physic.manage')}
        dialogProps={{
          PaperProps: {
            sx: { width: 512 },
          },
        }}
      >
        <Space>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>{T('common.name')}</TableCell>
                <TableCell>{T('physic.address')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nodes.map((n) => (
                <TableRow key={n.config}>
                  <TableCell padding="checkbox">
                    <Checkbox indeterminate checked={true} color="secondary" onChange={handleRemoveNode(n)} />
                  </TableCell>
                  <TableCell>{n.name}</TableCell>
                  <TableCell>{n.config}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box textAlign="right">
            <Button size="small" onClick={() => setOpen(false)}>
              {T('common.close')}
            </Button>
          </Box>
        </Space>
      </ConfirmDialog>
    </Space>
  )
}

export default Nodes
