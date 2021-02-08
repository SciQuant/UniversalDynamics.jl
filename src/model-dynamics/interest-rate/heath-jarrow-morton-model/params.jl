"""
    HeathJarrowMortonParameters

Wraps all the HJM relevant attributes in a single object.
"""
struct HeathJarrowMortonModelParameters{IIP,D,M,DN,T,
    Q,   # measure
    Te,  # <: AbstractVector
    U,   # <: AbstractVector
    S,   # <: Function that returns an AbstractVector
    R,
    C
} <: InterestRateModelDynamicsParameters
    Tenors::Te
    τ::U
    σ::S
    ρ::R
    cache::C
end
const HJMP = HeathJarrowMortonModelParameters

function HeathJarrowMortonModelParameters{IIP,D,M,DN,T}(
    t0::Real, L0::AbstractVector, τ::U, σ::S, ρ::R, measure::Q
) where {IIP,D,M,DN,T,Q,U,S,R}

    Tenors = tenor_structure(τ)
    Te = typeof(Tenors)

    isconcretetype(Q) || error("measure specification error.")

    if IIP
        cache = LiborMarketModelCache(L0)
    else
        cache = nothing
    end
    C = typeof(cache)

    
    return HeathJarrowMortonModelParameters{IIP,D,M,DN,T,Q,Te,U,S,R,C}(Tenors, τ, σ, ρ, cache)
end

tenor_structure(τ) = prepend!(cumsum(τ), zero(eltype(τ)))
tenor_structure(τ::SVector) = vcat(zero(eltype(τ)), cumsum(τ)) # vcat(similar_type(τ, Size(1))(zero(eltype(τ))), cumsum(τ))
