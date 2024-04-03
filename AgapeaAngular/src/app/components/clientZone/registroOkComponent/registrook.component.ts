import { Component } from '@angular/core';
import { RESTnodeService } from '../../../services/restnode.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, Subscriber, Subscription, concatMap, takeUntil, tap } from 'rxjs';
import { IRestMessage } from '../../../models/restmessage';

@Component({
  selector: 'app-registrook',
  templateUrl: './registrook.component.html',
  styleUrl: './registrook.component.css'
})
export class RegistrookComponent {

  // mode: any;
  // oobCode: any;
  // apiKey: any;

  // private unsubscribe$ = new Subject<void>();

  private paramSubscriptor!: Subscription;
  constructor(private restSvc: RESTnodeService,
    private router: Router,
    private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    /* la URL que se manda desde Firebase para activar cuenta tiene este formato : 
      http://localhost:4200/Cliente/RegistroOk ? mode=verifyEmail & oobCode=codigoclienteparaelquesehageneradoeltoken 
      
      1º ¿como extraigo params de la url en angular?
        -> tengo que hacer un metodo en el restnodeservice de activarEmail donde le pasamos estos params
        ___>Firebase requiere : correo del cliente que sigue el link de activacion, y  mode, oobCode, apiKey
    */
    //  let _mode : string | null = this.route.snapshot.queryParamMap.get('mode');
    //  let _oobCode : string | null = this.route.snapshot.queryParamMap.get('oobCode');
    //  let _apiKey : string | null = this.route.snapshot.queryParamMap.get('mode');

    //  let _res : IRestMessage = this.restSvc.activeEmail({_mode, _oobCode,_apiKey});

    // **** La ventaja de hacerlo con observable es que detectas los cambios en la url constantemente : 
    //**FORMATO OBSERVER : */
    //  this.route.queryParamMap.subscribe(
    //   {
    //     next: (dato) =>{}, <--- generalmente solo se requiere esta
    //     error: (err) =>{},
    //     complete: ()=>{}
    //   }
    //  );

    // this.paramSubscriptor = this.route.queryParamMap.subscribe((params: ParamMap) => {
    //   let _mode: string | null = params.get('mode');
    //   let _oobCode: string | null = params.get('oobCode');
    //   let _apiKey: string | null = params.get('mode');

    //   this.restSvc.activeEmail(_mode, _oobCode, _apiKey).subscribe(
    //     (res: IRestMessage) => {
    //       if (res.code == 0) {

    //       } else {

    //       }
    //     }
    //   );
    // });

    // ! operadores para manejar observables nested : concatMap() , mergeMap() , switchMap() , exahustMap()

    this.paramSubscriptor = this.actRoute
                                .queryParamMap
                                .pipe(
                                  tap((params: ParamMap) => console.log('parames url : ', params.keys)),
                                  concatMap((params : ParamMap)=>
                                                  {
                                                    let mode: string | null = params.get('mode');
                                                    let oobCode: string | null = params.get('oobCode');
                                                    let apiKey: string | null = params.get('apiKey');
                                                    return this.restSvc.activateAccount(mode, oobCode, apiKey);
                                                  }
                                                )


                                ).subscribe((res : IRestMessage)=>{
                                        if (res.code == 0) {
                                          this.router.navigateByUrl('/Cliente/Login'); 
                                        } else {
                                          //?mostrar mensaje de error en vista fallo de activacion
                                        }
                                });


  }

  ngOnDestroy(): void {
    this.paramSubscriptor.unsubscribe();
  }
}
