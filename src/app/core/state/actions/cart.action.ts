import { createAction, props } from '@ngrx/store';
import { Cart } from '../../application.types';

export const saveItemToCart = createAction(
    '[Cart] save item to cart',
    props<{ payload: Cart[] }>()
);

export const submitCartItems = createAction(
    '[Cart] submit cart items',
    props<{ payload: Cart[] }>()
);

export const handleCartItemSubmitSuccess = createAction(
    '[Cart] cart items saved successfully'
);

export const handleCartItemSubmitError = createAction(
    '[Cart] Error: cart items submit',
    props<Error>()
);



