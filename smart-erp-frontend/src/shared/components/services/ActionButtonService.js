export function useActionButtonData({ variant }) {
  let btnClass = 'btn-action-primary';
  let innerVariant = 'default';

  if (variant === 'outline') {
    btnClass = 'btn-action-outline';
    innerVariant = 'outline';
  } else if (variant === 'destructive' || variant === 'danger') {
    btnClass = 'btn-action-destructive';
    innerVariant = 'destructive';
  } else if (variant === 'secondary') {
    btnClass = 'btn-action-secondary';
    innerVariant = 'secondary';
  } else if (variant === 'primary') {
    btnClass = 'btn-action-primary';
    innerVariant = 'default';
  }

  return { btnClass, innerVariant };
}
