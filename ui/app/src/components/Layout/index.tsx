import Box, { BoxProps } from '@mui/joy/Box'
import Sheet from '@mui/joy/Sheet'

function Root(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          bgcolor: 'background.body',
          display: 'grid',
          gridTemplateRows: '64px 1fr',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '192px 1fr',
            md: '256px 1fr',
          },
          minHeight: '100vh',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  )
}

function Header(props: BoxProps) {
  return (
    <Box
      component="header"
      {...props}
      sx={[
        {
          px: 3,
          gap: 1.5,
          bgcolor: 'background.surface',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  )
}

function SideNav(props: BoxProps) {
  return (
    <Box
      component="nav"
      {...props}
      sx={[
        {
          p: 2,
          bgcolor: 'background.surface',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: {
            xs: 'none',
            sm: 'initial',
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  )
}

function Main(props: BoxProps) {
  return <Box component="main" {...props} sx={[{ p: 3 }, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]} />
}

function SideDrawer({ onClose, ...props }: BoxProps & { onClose: React.MouseEventHandler<HTMLDivElement> }) {
  return (
    <Box
      {...props}
      sx={[
        { position: 'fixed', zIndex: 1100, width: '100%', height: '100%' },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        role="button"
        onClick={onClose}
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: (theme) => `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
        }}
      />
      <Sheet
        sx={{
          minWidth: 256,
          width: 'max-content',
          height: '100%',
          p: 2,
          boxShadow: 'lg',
          bgcolor: 'background.surface',
        }}
      >
        {props.children}
      </Sheet>
    </Box>
  )
}

export default {
  Root,
  Header,
  SideNav,
  Main,
  SideDrawer,
}
